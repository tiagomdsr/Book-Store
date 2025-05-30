import createPrompt from "prompt-sync";

import { BookCategory } from "./types";

const prompt = createPrompt();

const getCategory = (): BookCategory => {
    let category: BookCategory;

    while (true) {
        console.log("Escolha o número da categoria do livro: \n");

        Object.values(BookCategory).forEach((category, index) => {
            console.log(`${index + 1} - ${category}`);
        });

        console.log();

        const option: number = Number(prompt("Escolha: "));

        switch (option) {
            case 1:
                category = BookCategory.Romance;
                break;
            case 2:
                category = BookCategory.Fantasia;
                break;
            case 3:
                category = BookCategory.FiccaoCientifica;
                break;
            case 4:
                category = BookCategory.Biografia;
                break;
            case 5:
                category = BookCategory.Historia;
                break;
            case 6:
                category = BookCategory.Tecnologia;
                break;
            case 7:
                category = BookCategory.Terror;
                break;
            case 8:
                category = BookCategory.Outro;
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