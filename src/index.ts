import createPrompt from "prompt-sync";
import chalk from "chalk";

import { buildBook, addBook, menuBook } from "./functions/bookFunctions";
import { buildAuthor, addAuthor, menuAuthor } from "./functions/authorFunctions";
import { buildPublisher, addPublisher, menuPublisher } from "./functions/publisherFunctions";

const prompt = createPrompt();

let menu: boolean = true;

async function main() {
    while (menu) {
        console.clear();
        console.log([
            chalk.blueBright("=================== MENU PRINCIPAL ===================="),
            "",
            `${chalk.blue("1")} - Adcionar um livro.`,
            "",
            `${chalk.blue("2")} - Buscar livro.`,
            "",
            `${chalk.blue("3")} - Adicionar autor(a).`,
            "",
            `${chalk.blue("4")} - Buscar autor(a).`,
            "",
            `${chalk.blue("5")} - Adicionar uma editora.`,
            "",
            `${chalk.blue("6")} - Buscar editora.`,
            "",
            `${chalk.red("0")} - Sair.`,
            "",
        ].join("\n"));

        const choice: number = Number(prompt(chalk.blue("Escolha: ")));

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