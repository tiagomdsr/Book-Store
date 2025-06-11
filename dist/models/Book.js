"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
class Book {
    constructor(title, summary, year, pages, isbn, categoryId, publisherId, authorId) {
        this.title = title;
        this.summary = summary;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.categoryId = categoryId;
        this.publisherId = publisherId;
        this.authorId = authorId;
    }
    toObject() {
        return {
            title: this.title,
            summary: this.summary,
            year: this.year,
            pages: this.pages,
            isbn: this.isbn,
            categoryId: this.categoryId,
            publisherId: this.categoryId,
            authorId: this.authorId
        };
    }
}
exports.Book = Book;
