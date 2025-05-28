"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const fs_1 = __importDefault(require("fs"));
const prompt = (0, prompt_sync_1.default)();
var BookCategory;
(function (BookCategory) {
    BookCategory["Romance"] = "Romance";
    BookCategory["Fantasia"] = "Fantasia";
    BookCategory["FiccaoCientifica"] = "Fic\u00E7\u00E3o Cient\u00EDfica";
    BookCategory["Biografia"] = "Biografia";
    BookCategory["Historia"] = "Hist\u00F3ria";
    BookCategory["Tecnologia"] = "Tecnologia";
    BookCategory["Terror"] = "Terror";
    BookCategory["Outro"] = "Outro";
})(BookCategory || (BookCategory = {}));
class Book {
    constructor(title, summary, year, pages, isbn, category) {
        this.title = title;
        this.summary = summary;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.category = category;
    }
    toObject() {
        return {
            title: this.title,
            summary: this.summary,
            year: this.year,
            pages: this.pages,
            isbn: this.isbn,
            category: this.category,
        };
    }
    static saveBook(bookObject, path) {
        let bookList = [];
        try {
            const data = fs_1.default.readFileSync(path, "utf-8");
            bookList = JSON.parse(data);
        }
        catch (err) {
            if (err.code === "ENOENT") {
                console.log(`\nArquivo ${path} ainda não existe, ele será criado agora.\n`);
            }
            else {
                throw err;
            }
        }
        bookList.push(bookObject);
        fs_1.default.writeFileSync(path, JSON.stringify(bookList, null, 2));
    }
}
const getCategory = () => {
    let category;
    while (true) {
        console.log("\nEscolha o número da categoria do livro: \n\n1 - Romance.\n2 - Fantasia.\n3 - Ficção Científica.\n4 - Biografia.\n5 - História.\n6 - Tecnologia.\n7 - Terror.\n8 - Outro.\n");
        const option = Number(prompt("Escolha: "));
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
};
let menu = true;
const currYear = new Date().getFullYear();
while (menu) {
    console.log("\n1 - Adcionar um livro.");
    console.log("\n2 - Buscar livro por categoria.");
    console.log("\n3 - Buscar livro por nome. ");
    console.log("\n0 - Sair\n");
    const choice = Number(prompt("Escolha: "));
    switch (choice) {
        case 0:
            menu = false;
            break;
        case 1:
            const title = prompt("Digite o título do livro: ");
            const summary = prompt("Digite o resumo do livro: ");
            let year;
            while (true) {
                year = Number(prompt("Digite o ano de lançamento do livro: "));
                if (year > currYear || year < 0 || !Number(year)) {
                    console.log("\nDigite um ano válido.\n");
                    continue;
                }
                break;
            }
            let pages;
            while (true) {
                pages = Number(prompt("Digite o número de páginas do livro: "));
                if (pages < 1 || !Number(pages)) {
                    console.log("\nDigite um número de páginas válido.\n");
                    continue;
                }
                break;
            }
            let isbn;
            while (true) {
                isbn = prompt("Digite o isbn do livro: ");
                if (isbn.length !== 13) {
                    console.log("\nDigite um ISBN válido, o ISBN deve ter 13 caracteres.\n");
                    continue;
                }
                break;
            }
            const category = getCategory();
            const book = new Book(title, summary, year, pages, isbn, category);
            const bookObject = book.toObject();
            Book.saveBook(bookObject, "./books.json");
            console.clear();
            console.log(`\nO livro ${book.title} foi adicionado com sucesso!\n`);
            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        case 2:
            try {
                const category = getCategory();
                const data = fs_1.default.readFileSync("./books.json", "utf-8");
                const bookList = JSON.parse(data);
                const filterBook = bookList.filter((book) => book.category === category);
                console.clear();
                if (filterBook.length > 0) {
                    console.log(`\nLivros da categoria ${category}:\n`);
                    console.log(filterBook);
                }
                else {
                    console.log(`\nNenhum livro com a categoria ${category} foi encontrado.\n`);
                }
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    console.log("\nO arquivo books.json não foi encontrado, adicione livros primeiro.\n");
                }
                else {
                    throw err;
                }
            }
            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        case 3:
            try {
                console.clear();
                const title = prompt("Digite o nome que deseja buscar: ");
                const data = fs_1.default.readFileSync("./books.json", "utf-8");
                const bookList = JSON.parse(data);
                const filterBook = bookList.filter((book) => book.title.includes(title));
                console.clear();
                if (filterBook.length > 0) {
                    console.log(`\nLivros contendo a palavra ${title}:\n`);
                    console.log(filterBook);
                }
                else {
                    console.log(`\nNenhum livro contendo a palavra ${title} foi encontrado.\n`);
                }
            }
            catch (err) {
                if (err.code === "ENOENT") {
                    console.log("\nO arquivo books.json não foi encontrado, adicione livros primeiro.\n");
                }
                else {
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
