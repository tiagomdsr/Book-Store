import fs from "fs";

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


export { Book, BookCategory, TypeBook };
