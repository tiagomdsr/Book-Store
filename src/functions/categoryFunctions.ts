import createPrompt from "prompt-sync";

import { BookCategory } from "../types";

const prompt = createPrompt();

function getCategory(): number {
    let category: number;

    while (true) {
        console.log("Escolha o número da categoria do livro: \n");

        Object.values(BookCategory).forEach((category, index) => {
            console.log(`${index + 1} - ${category}`);
        });

        console.log();

        const option: number = Number(prompt("Escolha: "));

        switch (option) {
            case 1:
                category = 1;
                break;
            case 2:
                category = 2;
                break;
            case 3:
                category = 3;
                break;
            case 4:
                category = 4;
                break;
            case 5:
                category = 5;
                break;
            case 6:
                category = 6;
                break;
            case 7:
                category = 7;
                break;
            case 8:
                category = 8;
                break;
            default:
                console.log("Escolha uma opção válida!\n");
                continue;
        }
        break;
    }

    return category;
}

export { getCategory };