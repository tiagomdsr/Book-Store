import createPrompt from "prompt-sync";

import { buildBook, addBook, menuBook } from "./functions/bookFunctions";
import { buildAuthor, addAuthor, menuAuthor } from "./functions/authorFunctions";
import { buildPublisher, addPublisher, menuPublisher } from "./functions/publisherFunctions";

const prompt = createPrompt();

let menu: boolean = true;

async function main() {
    while (menu) {
        console.clear();
        console.log([
            "========== MENU PRINCIPAL ==========",
            "",
            "1 - Adcionar um livro.",
            "",
            "2 - Buscar livro.",
            "",
            "3 - Adicionar autor(a).",
            "",
            "4 - Buscar autor(a).",
            "",
            "5 - Adicionar uma editora.",
            "",
            "6 - Buscar editora.",
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
                await addBook(await buildBook());
                prompt("\nAperte enter para voltar ao menu\n");

                continue;
            case 2:
                await menuBook();

                continue;
            case 3:
                await addAuthor(buildAuthor());
                prompt("\nAperte enter para voltar ao menu\n");

                continue;
            case 4:
                await menuAuthor();

                continue;
            case 5:
                await addPublisher(buildPublisher());
                prompt("\nAperte enter para voltar ao menu\n");

                continue;
            case 6:
                await menuPublisher();

                continue;
            default:
                console.log("\nOpção inválida\n");
        }
    }
}

main();