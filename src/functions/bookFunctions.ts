import { QueryResult } from "pg";
import CreatePrompt from "prompt-sync";

import { pool } from "../database/connection";
import { Book } from "../models/Book";
import { BookCategory, TypeBook } from "../types";
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

    const title: string = prompt("Digite o título do livro: ");
    const summary: string = prompt("Digite o resumo do livro: ");
    let authorId: number; 
    
    while (true) {
        let allAuthorsIds: number[] = [];

        const authorsList = await getAllAuthors();

        console.clear();

        console.log("Escolha de autor(a):\n")

        for (const author in authorsList) {
            console.log(`${authorsList[author].authorId} - ${authorsList[author].name}.`);
            allAuthorsIds.push(Number(authorsList[author].authorId!));
        };

        console.log("\n0 - Adicionar um(a) novo(a) autor(a).\n");

        console.log("Digite o número do(a) autor(a) do livro, ou crie um novo se não existir na lista: ");

        const option: number = Number(prompt("Escolha: "));

        const validOption: boolean = allAuthorsIds.includes(option);

        if (option === 0) {
            await addAuthor(buildAuthor());
            continue;
        } else if (!validOption) {
            console.log("\nDigite um autor válido\n");
            continue;
        }

        authorId = option;
        break;
    }

    let year: number;

    while (true) {
        year = Number(prompt("Digite o ano de lançamento do livro: "));

        if (year > currYear || year < 0 || !Number(year)) {
            console.log("\nDigite um ano válido.\n");
            continue;
        }

        break;
    }

    let pages: number;

    while (true) {
        pages = Number(prompt("Digite o número de páginas do livro: "));

        if (pages < 1 || !Number(pages)) {
            console.log("\nDigite um número de páginas válido.\n");
            continue;
        }

        break;
    }

    let isbn: string;

    while (true) {
        isbn = prompt("Digite o isbn do livro: ");

        if (isbn.length !== 13) {
            console.log("\nDigite um ISBN válido, o ISBN deve ter 13 caracteres.\n");
            continue;
        }

        break;
    }

    const category: number = getCategory();

    let publisherId: number; 
    
    while (true) {
        let allPublishersIds: number[] = [];

        const publishersList = await getAllPublishers();

        console.clear();

        console.log("Escolha de editora:\n");

        for (const publisher in publishersList) {
            console.log(`${publishersList[publisher].publisherId} - ${publishersList[publisher].name}.`);
            allPublishersIds.push(Number(publishersList[publisher].publisherId!));
        };

        console.log("\n0 - Adicionar uma nova editora.\n");

        console.log("Digite o número da editora do livro, ou crie uma nova se não existir na lista: ");

        const option: number = Number(prompt("Escolha: "));

        const validOption: boolean = allPublishersIds.includes(option);

        if (option === 0) {
            await addPublisher(buildPublisher());
            continue;
        } else if (!validOption) {
            console.log("\nDigite uma editora válida\n");
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
        const res: QueryResult<TypeBook> = await pool.query(
            "INSERT INTO livraria.livros(id_categoria, id_editora, id_autor, titulo, resumo, ano, paginas, isbn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
            [book.categoryId, book.publisherId, book.authorId, book.title, book.summary, book.year, book.pages, book.isbn]
        );

        console.clear();
        console.log(`Livro "${book.title}" adicionado com sucesso.`);
        console.log(res.rows);
    } catch (err: any) {
        console.log("Erro:", err);
    }
}

async function menuBook(): Promise<void> {
    
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            "1 - Listar todos os livros.",
            "",
            "2 - Buscar livro por categoria.",
            "",
            "3 - Buscar livro por nome.",
            "",
            "0 - Voltar ao menu principal",
            "",  
        ].join("\n"));

        const choice: number = Number(prompt("Escolha: "))

        switch(choice) {
            case 0:
                menu = false;

                break;
            case 1:
                console.clear();
                const books: TypeBook[] = await getAllBooks();

                console.log("Livros: ");
                console.log(books);
                prompt("\nAperte enter para voltar ao menu\n");

                break;
            case 2:
                console.clear();
                const category: number = getCategory();
                
                await getBook(category);
                prompt("\nAperte enter para voltar ao menu\n");
                
                break;
            case 3:
                console.clear();
                const search: string = prompt("Digite o nome do livro que deseja buscar: ");

                await getBook(search);
                prompt("\nAperte enter para voltar ao menu\n");

                break;
            default:
                console.log("\nOpção inválida\n");
        }
    }
}

async function getAllBooks(): Promise<TypeBook[]> {
    try {
        const res: QueryResult<TypeBook> = await pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros;`);

        if (res.rows.length === 0) {
            console.clear();
            console.log("Nenhum livro cadastrado");
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("Erro:", err);
        return [];
    }
}

async function getBook(search: string | number): Promise<void> {
    try {
        let res: QueryResult<TypeBook>;

        if (typeof search === "string") {
            res = await pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros WHERE titulo ILIKE $1`, [`%${search}%`]);
        } else {
            res = await pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros WHERE id_categoria = $1`, [search]);  
        }
        
        if (res.rows.length === 0) {
            console.clear()
            if (typeof search === "string") {
                console.log(`Nenhum livro com contendo a palavra "${search}" foi encontrado.`);
            } else {
                console.log(`Nenhum livro da categoria ${Object.values(BookCategory)[search - 1]} encontrado.`);
            }    
        } else {
            console.clear();
            if (typeof search === "string") {
                console.log(`Livros contendo a palavra "${search}": \n`);
            } else {
                console.log(`Livros de ${Object.values(BookCategory)[search - 1]}: \n`);
            }

            console.log(res.rows);
        }
    } catch (err: any) {
        console.error("Erro:", err);
    }
}

export { getBook, menuBook, buildBook, addBook };