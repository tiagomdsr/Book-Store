import { TypeBook } from "../types"

class Book {
    title: string;
    summary: string;
    year: number;
    pages: number;
    isbn: string;
    categoryId: number;
    publisherId: number;
    authorId: number;

    constructor(title: string, summary: string, year: number, pages: number, isbn: string, categoryId: number, publisherId: number, authorId: number) {
        this.title = title;
        this.summary = summary;
        this.year = year;
        this.pages = pages;
        this.isbn = isbn;
        this.categoryId = categoryId;
        this.publisherId = publisherId;
        this.authorId = authorId;
    }

    public toObject(): TypeBook {
        return {
            title: this.title,
            summary: this.summary,
            year: this.year,
            pages: this.pages,
            isbn: this.isbn,
            categoryId: this.categoryId,
            publisherId: this.categoryId,
            authorId: this.authorId
        }
    }
}

export { Book };