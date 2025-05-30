"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
const prompt = (0, prompt_sync_1.default)();
const getCategory = () => {
    let category;
    while (true) {
        console.log("Escolha o número da categoria do livro: \n");
        Object.values(types_1.BookCategory).forEach((category, index) => {
            console.log(`${index + 1} - ${category}`);
        });
        console.log();
        const option = Number(prompt("Escolha: "));
        switch (option) {
            case 1:
                category = types_1.BookCategory.Romance;
                break;
            case 2:
                category = types_1.BookCategory.Fantasia;
                break;
            case 3:
                category = types_1.BookCategory.FiccaoCientifica;
                break;
            case 4:
                category = types_1.BookCategory.Biografia;
                break;
            case 5:
                category = types_1.BookCategory.Historia;
                break;
            case 6:
                category = types_1.BookCategory.Tecnologia;
                break;
            case 7:
                category = types_1.BookCategory.Terror;
                break;
            case 8:
                category = types_1.BookCategory.Outro;
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
while (menu) {
    const currYear = new Date().getFullYear();
    console.clear();
    console.log([
        "1 - Adcionar um livro.",
        "",
        "2 - Buscar livro por categoria.",
        "",
        "3 - Buscar livro por nome.",
        "",
        "0 - Sair.",
        "",
    ].join("\n"));
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
            const book = new types_1.Book(title, summary, year, pages, isbn, category);
            const bookObject = book.toObject();
            types_1.Book.saveBook(bookObject, "./books.json");
            console.clear();
            console.log(`\nO livro ${book.title} foi adicionado com sucesso!\n`);
            prompt("\nAperte enter para voltar ao menu\n");
            continue;
        case 2:
            try {
                console.clear();
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
                const filterBook = bookList.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
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
