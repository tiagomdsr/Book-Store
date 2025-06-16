import { QueryResult } from "pg";
import CreatePrompt from "prompt-sync";
import chalk from "chalk";

import { pool } from "../database/connection";
import { Book } from "../models/Book";
import { BookCategory, TypeBook, TypeBookPrint } from "../types";
import { getCategory } from "../functions/categoryFunctions";
import { addAuthor, buildAuthor, getAllAuthors } from "./authorFunctions";
import { addPublisher, buildPublisher, getAllPublishers } from "./publisherFunctions";

const prompt = CreatePrompt();

const bookConvertTypeKeys: string = `
                    id_livro AS "bookId",
                    titulo AS title,
                    resumo AS summary,
                    ano AS year,
                    paginas AS pages,
                    isbn,
                    id_categoria AS "categoryId",
                    id_autor AS "authorId",
                    id_editora AS "publisherId"
`;

async function buildBook() {
    const currYear: number = new Date().getFullYear();

    console.clear();

    const title: string = prompt(chalk.blue("Digite o título do livro: "));
    const summary: string = prompt(chalk.blue("Digite o resumo do livro: "));
    let authorId: number; 
    
    while (true) {
        let allAuthorsIds: number[] = [];

        console.clear();

        console.log(chalk.blueBright("Escolha de autor(a):\n"));

        const authorsList = await getAllAuthors();

        for (const author in authorsList) {
            console.log(`${chalk.blue(authorsList[author].authorId)} - ${authorsList[author].name}.`);
            allAuthorsIds.push(Number(authorsList[author].authorId!));
        };

        console.log(`\n${chalk.blue("0")} - Adicionar um(a) novo(a) autor(a).\n`);

        console.log(chalk.blue("Digite o número do(a) autor(a) do livro, ou crie um novo se não existir na lista: "));

        const option: number = Number(prompt(chalk.blue("Escolha: ")));

        const validOption: boolean = allAuthorsIds.includes(option);

        if (option === 0) {
            await addAuthor(buildAuthor());
            continue;
        } else if (!validOption) {
            console.log(chalk.red("\nDigite um autor válido\n"));
            continue;
        }

        authorId = option;
        break;
    }

    let year: number;

    while (true) {
        year = Number(prompt(chalk.blue("Digite o ano de lançamento do livro: ")));

        if (year > currYear || year < 0 || !Number(year)) {
            console.log(chalk.red("\nDigite um ano válido.\n"));
            continue;
        }

        break;
    }

    let pages: number;

    while (true) {
        pages = Number(prompt(chalk.blue("Digite o número de páginas do livro: ")));

        if (pages < 1 || !Number(pages)) {
            console.log(chalk.red("\nDigite um número de páginas válido.\n"));
            continue;
        }

        break;
    }

    let isbn: string;

    while (true) {
        isbn = prompt(chalk.blue("Digite o isbn do livro: "));

        if (isbn.length !== 13) {
            console.log(chalk.red("\nDigite um ISBN válido, o ISBN deve ter 13 caracteres.\n"));
            continue;
        }

        break;
    }

    const category: number = getCategory();

    let publisherId: number; 
    
    while (true) {
        let allPublishersIds: number[] = [];

        console.clear();

        console.log(chalk.blueBright("Escolha de editora:\n"));

        const publishersList = await getAllPublishers();

        for (const publisher in publishersList) {
            console.log(`${chalk.blue(publishersList[publisher].publisherId)} - ${publishersList[publisher].name}.`);
            allPublishersIds.push(Number(publishersList[publisher].publisherId!));
        };

        console.log(`\n${chalk.blue("0")} - Adicionar uma nova editora.\n`);

        console.log(chalk.blue("Digite o número da editora do livro, ou crie uma nova se não existir na lista: "));

        const option: number = Number(prompt(chalk.blue("Escolha: ")));

        const validOption: boolean = allPublishersIds.includes(option);

        if (option === 0) {
            await addPublisher(buildPublisher());
            continue;
        } else if (!validOption) {
            console.log(chalk.red("\nDigite uma editora válida\n"));
            continue;
        }

        publisherId = option;
        break;
    }

    const book: Book = new Book(title, summary, year, pages, isbn, category, publisherId, authorId);

    return book.toObject();
}

async function addBook(book: TypeBook): Promise<void> {
    try {
        await pool.query(
            "INSERT INTO livraria.livros(id_categoria, id_editora, id_autor, titulo, resumo, ano, paginas, isbn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
            [book.categoryId, book.publisherId, book.authorId, book.title, book.summary, book.year, book.pages, book.isbn]
        );

        console.clear();
        console.log(`Livro "${chalk.blue(book.title)}" adicionado com sucesso.`);
    } catch (err: any) {
        console.log(chalk.red("Erro:"), err);
    }
}

async function menuBook(): Promise<void> {
    
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            chalk.blueBright("=================== BUSCAR LIVRO ===================="),
            "",
            `${chalk.blue("1")} - Listar todos os livros.`,
            "",
            `${chalk.blue("2")} - Buscar livro por categoria.`,
            "",
            `${chalk.blue("3")} - Buscar livro por nome.`,
            "",
            `${chalk.red("0")} - Voltar ao menu principal`,
            "",  
        ].join("\n"));

        const choice: number = Number(prompt(chalk.blue("Escolha: ")));

        switch(choice) {
            case 0:
                menu = false;

                break;
            case 1:
                console.clear();
                const books: TypeBookPrint[] = await getAllBooksPretty();

                console.log(chalk.blueBright("Livros: "));
                
                printBooks(books);
                
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));

                break;
            case 2:
                console.clear();
                const category: number = getCategory();
                console.clear();
                
                console.log(`Livros de ${chalk.blue(Object.values(BookCategory)[category - 1])}:`);
                printBooks(await getBook(category));
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));
                
                break;
            case 3:
                console.clear();
                const search: string = prompt(chalk.blue("Digite o nome do livro que deseja buscar: "));
                console.clear();
                
                console.log(`Livros contendo a palavra "${chalk.blue(search)}":`);
                printBooks(await getBook(search));
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));

                break;
            default:
                console.log(chalk.red("\nOpção inválida\n"));
        }
    }
}

async function getAllBooksRaw(): Promise<TypeBook[]> {
    try {
        const res: QueryResult<TypeBook> = await pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros;`)

        if (res.rows.length === 0) {
            console.clear();
            console.log(chalk.red("Nenhum livro cadastrado"));
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log(chalk.red("Erro:"), err);
        return [];
    }    
    
}

async function getAllBooksPretty(): Promise<TypeBookPrint[]> {
    try {
        const res: QueryResult<TypeBookPrint> = await pool.query(`
            SELECT l.titulo AS title, c.nome AS category, l.ano AS year, l.resumo AS summary, a.nome AS author, e.nome AS publisher FROM livraria.livros l
            LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
            LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
            LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora;
            `);

        if (res.rows.length === 0) {
            console.clear();
            console.log(chalk.red("Nenhum livro cadastrado"));
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log(chalk.red("Erro:"), err);
        return [];
    }
}

async function getBook(search: string | number): Promise<TypeBookPrint[]> {
    try {
        let res: QueryResult<TypeBookPrint>;

        if (typeof search === "string") {
            res = await pool.query(`
                SELECT l.titulo AS title, c.nome AS category, l.resumo AS summary, l.ano AS year, a.nome AS author, e.nome AS publisher FROM livraria.livros l
                LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
                LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
                LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora
                WHERE l.titulo ILIKE $1;
                `, [`%${search}%`]);
        } else {
            res = await pool.query(`
                SELECT l.titulo AS title, c.nome AS category, l.ano AS year, l.resumo AS summary, a.nome AS author, e.nome AS publisher FROM livraria.livros l
                LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
                LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
                LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora
                WHERE l.id_categoria = $1;
                `, [search]);  
        }
        
        if (res.rows.length === 0) {
            console.clear()
            if (typeof search === "string") {
                console.log("\n=================================================\n");
                console.log(chalk.red(`Nenhum livro com contendo a palavra "${search}" foi encontrado.`));
                return [];
            } else {
                console.log("\n=================================================\n");
                console.log(chalk.red(`Nenhum livro da categoria ${Object.values(BookCategory)[search - 1]} encontrado.`));
                return [];
            }    
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("\n=================================================\n");
        console.error(chalk.red("Erro:"), err);
        return [];
    }
}

function printBooks(books: TypeBookPrint[]): void {
    for (const book in books) {
        console.log("\n=================================================\n");
        console.log(`${chalk.blue("Título:")} ${books[book].title}\n${chalk.blue("Categoria:")} ${books[book].category}\n${chalk.blue("Resumo:")} ${books[book].summary}\n${chalk.blue("Lançamento:")} ${books[book].year}\n${chalk.blue("Autor(a):")} ${books[book].author}\n${chalk.blue("Editora:")} ${books[book].publisher}`);
    }

    console.log("\n=================================================\n");
}

export { getAllBooksRaw, menuBook, buildBook, addBook };