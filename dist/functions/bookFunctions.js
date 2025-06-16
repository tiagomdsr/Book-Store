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
exports.getAllBooksRaw = getAllBooksRaw;
exports.menuBook = menuBook;
exports.buildBook = buildBook;
exports.addBook = addBook;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const chalk_1 = __importDefault(require("chalk"));
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
        const title = prompt(chalk_1.default.blue("Digite o título do livro: "));
        const summary = prompt(chalk_1.default.blue("Digite o resumo do livro: "));
        let authorId;
        while (true) {
            let allAuthorsIds = [];
            console.clear();
            console.log(chalk_1.default.blueBright("Escolha de autor(a):\n"));
            const authorsList = yield (0, authorFunctions_1.getAllAuthors)();
            for (const author in authorsList) {
                console.log(`${chalk_1.default.blue(authorsList[author].authorId)} - ${authorsList[author].name}.`);
                allAuthorsIds.push(Number(authorsList[author].authorId));
            }
            ;
            console.log(`\n${chalk_1.default.blue("0")} - Adicionar um(a) novo(a) autor(a).\n`);
            console.log(chalk_1.default.blue("Digite o número do(a) autor(a) do livro, ou crie um novo se não existir na lista: "));
            const option = Number(prompt(chalk_1.default.blue("Escolha: ")));
            const validOption = allAuthorsIds.includes(option);
            if (option === 0) {
                yield (0, authorFunctions_1.addAuthor)((0, authorFunctions_1.buildAuthor)());
                continue;
            }
            else if (!validOption) {
                console.log(chalk_1.default.red("\nDigite um autor válido\n"));
                continue;
            }
            authorId = option;
            break;
        }
        let year;
        while (true) {
            year = Number(prompt(chalk_1.default.blue("Digite o ano de lançamento do livro: ")));
            if (year > currYear || year < 0 || !Number(year)) {
                console.log(chalk_1.default.red("\nDigite um ano válido.\n"));
                continue;
            }
            break;
        }
        let pages;
        while (true) {
            pages = Number(prompt(chalk_1.default.blue("Digite o número de páginas do livro: ")));
            if (pages < 1 || !Number(pages)) {
                console.log(chalk_1.default.red("\nDigite um número de páginas válido.\n"));
                continue;
            }
            break;
        }
        let isbn;
        while (true) {
            isbn = prompt(chalk_1.default.blue("Digite o isbn do livro: "));
            if (isbn.length !== 13) {
                console.log(chalk_1.default.red("\nDigite um ISBN válido, o ISBN deve ter 13 caracteres.\n"));
                continue;
            }
            break;
        }
        const category = (0, categoryFunctions_1.getCategory)();
        let publisherId;
        while (true) {
            let allPublishersIds = [];
            console.clear();
            console.log(chalk_1.default.blueBright("Escolha de editora:\n"));
            const publishersList = yield (0, publisherFunctions_1.getAllPublishers)();
            for (const publisher in publishersList) {
                console.log(`${chalk_1.default.blue(publishersList[publisher].publisherId)} - ${publishersList[publisher].name}.`);
                allPublishersIds.push(Number(publishersList[publisher].publisherId));
            }
            ;
            console.log(`\n${chalk_1.default.blue("0")} - Adicionar uma nova editora.\n`);
            console.log(chalk_1.default.blue("Digite o número da editora do livro, ou crie uma nova se não existir na lista: "));
            const option = Number(prompt(chalk_1.default.blue("Escolha: ")));
            const validOption = allPublishersIds.includes(option);
            if (option === 0) {
                yield (0, publisherFunctions_1.addPublisher)((0, publisherFunctions_1.buildPublisher)());
                continue;
            }
            else if (!validOption) {
                console.log(chalk_1.default.red("\nDigite uma editora válida\n"));
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
            yield connection_1.pool.query("INSERT INTO livraria.livros(id_categoria, id_editora, id_autor, titulo, resumo, ano, paginas, isbn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;", [book.categoryId, book.publisherId, book.authorId, book.title, book.summary, book.year, book.pages, book.isbn]);
            console.clear();
            console.log(`Livro "${chalk_1.default.blue(book.title)}" adicionado com sucesso.`);
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
        }
    });
}
function menuBook() {
    return __awaiter(this, void 0, void 0, function* () {
        let menu = true;
        while (menu) {
            console.clear();
            console.log([
                chalk_1.default.blueBright("=================== BUSCAR LIVRO ===================="),
                "",
                `${chalk_1.default.blue("1")} - Listar todos os livros.`,
                "",
                `${chalk_1.default.blue("2")} - Buscar livro por categoria.`,
                "",
                `${chalk_1.default.blue("3")} - Buscar livro por nome.`,
                "",
                `${chalk_1.default.red("0")} - Voltar ao menu principal`,
                "",
            ].join("\n"));
            const choice = Number(prompt(chalk_1.default.blue("Escolha: ")));
            switch (choice) {
                case 0:
                    menu = false;
                    break;
                case 1:
                    console.clear();
                    const books = yield getAllBooksPretty();
                    console.log(chalk_1.default.blueBright("Livros: "));
                    printBooks(books);
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                case 2:
                    console.clear();
                    const category = (0, categoryFunctions_1.getCategory)();
                    console.clear();
                    console.log(`Livros de ${chalk_1.default.blue(Object.values(types_1.BookCategory)[category - 1])}:`);
                    printBooks(yield getBook(category));
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                case 3:
                    console.clear();
                    const search = prompt(chalk_1.default.blue("Digite o nome do livro que deseja buscar: "));
                    console.clear();
                    console.log(`Livros contendo a palavra "${chalk_1.default.blue(search)}":`);
                    printBooks(yield getBook(search));
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                default:
                    console.log(chalk_1.default.red("\nOpção inválida\n"));
            }
        }
    });
}
function getAllBooksRaw() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${bookConvertTypeKeys} FROM livraria.livros;`);
            if (res.rows.length === 0) {
                console.clear();
                console.log(chalk_1.default.red("Nenhum livro cadastrado"));
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
            return [];
        }
    });
}
function getAllBooksPretty() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`
            SELECT l.titulo AS title, c.nome AS category, l.ano AS year, l.resumo AS summary, a.nome AS author, e.nome AS publisher FROM livraria.livros l
            LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
            LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
            LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora;
            `);
            if (res.rows.length === 0) {
                console.clear();
                console.log(chalk_1.default.red("Nenhum livro cadastrado"));
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
            return [];
        }
    });
}
function getBook(search) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res;
            if (typeof search === "string") {
                res = yield connection_1.pool.query(`
                SELECT l.titulo AS title, c.nome AS category, l.resumo AS summary, l.ano AS year, a.nome AS author, e.nome AS publisher FROM livraria.livros l
                LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
                LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
                LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora
                WHERE l.titulo ILIKE $1;
                `, [`%${search}%`]);
            }
            else {
                res = yield connection_1.pool.query(`
                SELECT l.titulo AS title, c.nome AS category, l.ano AS year, l.resumo AS summary, a.nome AS author, e.nome AS publisher FROM livraria.livros l
                LEFT JOIN livraria.categorias c ON l.id_categoria = c.id_categoria
                LEFT JOIN livraria.autores a ON l.id_autor = a.id_autor 
                LEFT JOIN livraria.editoras e ON l.id_editora = e.id_editora
                WHERE l.id_categoria = $1;
                `, [search]);
            }
            if (res.rows.length === 0) {
                console.clear();
                if (typeof search === "string") {
                    console.log("\n=================================================\n");
                    console.log(chalk_1.default.red(`Nenhum livro com contendo a palavra "${search}" foi encontrado.`));
                    return [];
                }
                else {
                    console.log("\n=================================================\n");
                    console.log(chalk_1.default.red(`Nenhum livro da categoria ${Object.values(types_1.BookCategory)[search - 1]} encontrado.`));
                    return [];
                }
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log("\n=================================================\n");
            console.error(chalk_1.default.red("Erro:"), err);
            return [];
        }
    });
}
function printBooks(books) {
    for (const book in books) {
        console.log("\n=================================================\n");
        console.log(`${chalk_1.default.blue("Título:")} ${books[book].title}\n${chalk_1.default.blue("Categoria:")} ${books[book].category}\n${chalk_1.default.blue("Resumo:")} ${books[book].summary}\n${chalk_1.default.blue("Lançamento:")} ${books[book].year}\n${chalk_1.default.blue("Autor(a):")} ${books[book].author}\n${chalk_1.default.blue("Editora:")} ${books[book].publisher}`);
    }
    console.log("\n=================================================\n");
}
