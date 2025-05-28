import createPrompt from "prompt-sync";
import fs from "fs";

const prompt = createPrompt();

enum BookCategory {
    Romance = "Romance",
    Fantasia = "Fantasia",
    FiccaoCientifica = "Ficção Científica",
    Biografia = "Biografia",
    Historia = "História",
    Tecnologia = "Tecnologia",
    Terror = "Terror",
    Outro = "Outro",
}

type TypeBook = {
    title: string;
    summary: string;
    year: number;
    pages: number;
    isbn: string;
    category: BookCategory;
}

class Book {
    title: string;
    summary: string;
    year: number;
    pages: number;
    isbn: string;
    category: BookCategory;

    constructor(title: string, summary: string, year: number, pages: number, isbn: string, category: BookCategory) {
        this.title = title;
        this.summary = summary;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.category = category;
    }

    public toObject(): TypeBook {
        return {
            title: this.title,
            summary: this.summary,
            year: this.year,
            pages: this.pages,
            isbn: this.isbn,
            category: this.category,
        }
    }

    public static saveBook(bookObject: TypeBook, path: string) {
        let bookList: TypeBook[] = [];

        try {
            const data: string = fs.readFileSync(path, "utf-8");
            bookList = JSON.parse(data);
        } catch (err: any) {
            if (err.code === "ENOENT") {
                console.log(`\nArquivo ${path} ainda não existe, ele será criado agora.\n`);
            } else {
                throw err;
            }
        }

        bookList.push(bookObject);

        fs.writeFileSync(path, JSON.stringify(bookList, null, 2));
    }
}

const getCategory = (): BookCategory => {
    let category: BookCategory;

    while (true) {
        console.log("\nEscolha o número da categoria do livro: \n\n1 - Romance.\n2 - Fantasia.\n3 - Ficção Científica.\n4 - Biografia.\n5 - História.\n6 - Tecnologia.\n7 - Terror.\n8 - Outro.\n");
        const option: number = Number(prompt("Escolha: "));

        switch (option) {
            case 1:
                category = BookCategory.Romance;
                break;
            case 2:
                category = BookCategory.Fantasia;
                break;
            case 3:
                category = BookCategory.FiccaoCientifica;
                break;
            case 4:
                category = BookCategory.Biografia;
                break;
            case 5:
                category = BookCategory.Historia;
                break;
            case 6:
                category = BookCategory.Tecnologia;
                break;
            case 7:
                category = BookCategory.Terror;
                break;
            case 8:
                category = BookCategory.Outro;
                break;
            default:
                console.log("Escolha uma opção válida!\n");
                continue;
        }
        break;
    }

    return category;
}

let menu: boolean = true;

const currYear: number = new Date().getFullYear();

while (menu) {
    console.log("\n1 - Adcionar um livro.");

    console.log("\n2 - Buscar livro por categoria.");

    console.log("\n3 - Buscar livro por nome. ");

    console.log("\n0 - Sair\n");

    const choice: number = Number(prompt("Escolha: "));

    switch (choice) {
        case 0: 
            menu = false;
            break;
        case 1:
            const title: string = prompt("Digite o título do livro: ");
            const summary: string = prompt("Digite o resumo do livro: ");

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
            
            const category: BookCategory = getCategory();

            const book: Book = new Book(title, summary, year, pages, isbn, category);

            const bookObject: TypeBook = book.toObject();

            Book.saveBook(bookObject, "./books.json");

            console.clear();

            console.log(`\nO livro ${book.title} foi adicionado com sucesso!\n`);

            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        case 2:
            try {
                const category: BookCategory = getCategory();
                const data: string = fs.readFileSync("./books.json", "utf-8");
                const bookList: TypeBook[] = JSON.parse(data);

                const filterBook: TypeBook[] = bookList.filter((book) => book.category === category);

                console.clear();

                if (filterBook.length > 0) {
                    console.log(`\nLivros da categoria ${category}:\n`);

                    console.log(filterBook);
                } else {
                    console.log(`\nNenhum livro com a categoria ${category} foi encontrado.\n`);
                }                
            } catch (err:any) {
                if (err.code === "ENOENT") {
                    console.log("\nO arquivo books.json não foi encontrado, adicione livros primeiro.\n");
                } else {
                    throw err;
                } 
            }
            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        case 3:
            try {
                console.clear();
                const title = prompt("Digite o nome que deseja buscar: ");

                const data: string = fs.readFileSync("./books.json", "utf-8");
                const bookList: TypeBook[] = JSON.parse(data);

                const filterBook: TypeBook[] = bookList.filter((book) => book.title.includes(title));

                console.clear();

                if (filterBook.length > 0) {
                    console.log(`\nLivros contendo a palavra ${title}:\n`);

                    console.log(filterBook);
                } else {
                    console.log(`\nNenhum livro contendo a palavra ${title} foi encontrado.\n`);
                }  
            } catch (err:any) {
                if (err.code === "ENOENT") {
                    console.log("\nO arquivo books.json não foi encontrado, adicione livros primeiro.\n");
                } else {
                    throw err;
                }
            } 
            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        default:
            console.log("\nOpção inválida\n");
            continue;
    }
}
