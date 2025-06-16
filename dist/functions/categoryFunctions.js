"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = getCategory;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const chalk_1 = __importDefault(require("chalk"));
const types_1 = require("../types");
const prompt = (0, prompt_sync_1.default)();
function getCategory() {
    let category;
    while (true) {
        console.log(chalk_1.default.blueBright("Escolha o número da categoria do livro: \n"));
        Object.values(types_1.BookCategory).forEach((category, index) => {
            console.log(`${chalk_1.default.blue(`${index + 1}`)} - ${category}`);
        });
        console.log();
        const option = Number(prompt(chalk_1.default.blue("Escolha: ")));
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
