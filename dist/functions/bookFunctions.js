"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBook = getBook;
exports.menuBook = menuBook;
exports.buildBook = buildBook;
exports.addBook = addBook;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const connection_1 = require("../database/connection");
const Book_1 = require("../models/Book");
const types_1 = require("../types");
const categoryFunctions_1 = require("../functions/categoryFunctions");
const authorFunctions_1 = require("./authorFunctions");
const publisherFunctions_1 = require("./publisherFunctions");
const prompt = (0, prompt_sync_1.default)();
const bookConvertTypeKeys = `
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
function buildBook() {
    return __awaiter(this, void 0, void 0, function* () {
        const currYear = new Date().getFullYear();
        console.clear();
        const title = prompt("Digite o título do livro: ");
        const summary = prompt("Digite o resumo do livro: ");
        let authorId;
        while (true) {
            let allAuthorsIds = [];
            const authorsList = yield (0, authorFunctions_1.getAllAuthors)();
            console.clear();
            console.log("Escolha de autor(a):\n");
            for (const author in authorsList) {
                console.log(`${authorsList[author].authorId} - ${authorsList[author].name}.`);
                allAuthorsIds.push(Number(authorsList[author].authorId));
            }
            ;
            console.log("\n0 - Adicionar um(a) novo(a) autor(a).\n");
            console.log("Digite o número do(a) autor(a) do livro, ou crie um novo se não existir na lista: ");
            const option = Number(prompt("Escolha: "));
            const validOption = allAuthorsIds.includes(option);
            if (option === 0) {
                yield (0, authorFunctions_1.addAuthor)((0, authorFunctions_1.buildAuthor)());
                continue;
            }
            else if (!validOption) {
                console.log("\nDigite um autor válido\n");
                continue;
            }
            authorId = option;
            break;
        }
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
        const category = (0, categoryFunctions_1.getCategory)();
        let publisherId;
        while (true) {
            let allPublishersIds = [];
            const publishersList = yield (0, publisherFunctions_1.getAllPublishers)();
            console.clear();
            console.log("Escolha de editora:\n");
            for (const publisher in publishersList) {
                console.log(`${publishersList[publisher].publisherId} - ${publishersList[publisher].name}.`);
                allPublishersIds.push(Number(publishersList[publisher].publisherId));
            }
            ;
            console.log("\n0 - Adicionar uma nova editora.\n");
            console.log("Digite o número da editora do livro, ou crie uma nova se não existir na lista: ");
            const option = Number(prompt("Escolha: "));
            const validOption = allPublishersIds.includes(option);
            if (option === 0) {
                yield (0, publisherFunctions_1.addPublisher)((0, publisherFunctions_1.buildPublisher)());
                continue;
            }
            else if (!validOption) {
                console.log("\nDigite uma editora válida\n");
                continue;
            }
            publisherId = option;
            break;
        }
        const book = new Book_1.Book(title, summary, year, pages, isbn, category, publisherId, authorId);
        return book.toObject();
    });
}
function addBook(book) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query("INSERT INTO livraria.livros(id_categoria, id_editora, id_autor, titulo, resumo, ano, paginas, isbn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;", [book.categoryId, book.publisherId, book.authorId, book.title, book.summary, book.year, book.pages, book.isbn]);
            console.clear();
            console.log(`Livro "${book.title}" adicionado com sucesso.`);
            console.log(res.rows);
        }
        catch (err) {
            console.log("Erro:", err);
        }
    });
}
function menuBook() {
    return __awaiter(this, void 0, void 0, function* () {
        let menu = true;
        while (menu) {
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
            const choice = Number(prompt("Escolha: "));
            switch (choice) {
                case 0:
                    menu = false;
                    break;
                case 1:
                    console.clear();
                    const books = yield getAllBooks();
                    console.log("Livros: ");
                    console.log(books);
                    prompt("\nAperte enter para voltar ao menu\n");
                    break;
                case 2:
                    console.clear();
                    const category = (0, categoryFunctions_1.getCategory)();
                    yield getBook(category);
                    prompt("\nAperte enter para voltar ao menu\n");
                    break;
                case 3:
                    console.clear();
                    const search = prompt("Digite o nome do livro que deseja buscar: ");
                    yield getBook(search);
                    prompt("\nAperte enter para voltar ao menu\n");
                    break;
                default:
                    console.log("\nOpção inválida\n");
            }
        }
    });
}
function getAllBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros;`);
            if (res.rows.length === 0) {
                console.clear();
                console.log("Nenhum livro cadastrado");
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log("Erro:", err);
            return [];
        }
    });
}
function getBook(search) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res;
            if (typeof search === "string") {
                res = yield connection_1.pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros WHERE titulo ILIKE $1`, [`%${search}%`]);
            }
            else {
                res = yield connection_1.pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros WHERE id_categoria = $1`, [search]);
            }
            if (res.rows.length === 0) {
                console.clear();
                if (typeof search === "string") {
                    console.log(`Nenhum livro com contendo a palavra "${search}" foi encontrado.`);
                }
                else {
                    console.log(`Nenhum livro da categoria ${Object.values(types_1.BookCategory)[search - 1]} encontrado.`);
                }
            }
            else {
                console.clear();
                if (typeof search === "string") {
                    console.log(`Livros contendo a palavra "${search}": \n`);
                }
                else {
                    console.log(`Livros de ${Object.values(types_1.BookCategory)[search - 1]}: \n`);
                }
                console.log(res.rows);
            }
        }
        catch (err) {
            console.error("Erro:", err);
        }
    });
}
