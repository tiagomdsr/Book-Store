"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategory = exports.Book = void 0;
const fs_1 = __importDefault(require("fs"));
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
exports.Book = Book;
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
})(BookCategory || (exports.BookCategory = BookCategory = {}));
