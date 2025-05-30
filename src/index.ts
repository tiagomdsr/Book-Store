import createPrompt from "prompt-sync";
import fs from "fs";

import { Book, BookCategory, TypeBook } from "./types";
import { getCategory } from "./functions";

const prompt = createPrompt();

let menu: boolean = true;

while (menu) {
    const currYear: number = new Date().getFullYear();

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
                console.clear();
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

                const filterBook: TypeBook[] = bookList.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));

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
