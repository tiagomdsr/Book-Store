"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = void 0;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const types_1 = require("./types");
const prompt = (0, prompt_sync_1.default)();
const getCategory = () => {
    let category;
    while (true) {
        console.log("Escolha o número da categoria do livro: \n");
        Object.values(types_1.BookCategory).forEach((category, index) => {
            console.log(`${index + 1} - ${category}`);
        });
        console.log();
        const option = Number(prompt("Escolha: "));
        switch (option) {
            case 1:
                category = types_1.BookCategory.Romance;
                break;
            case 2:
                category = types_1.BookCategory.Fantasia;
                break;
            case 3:
                category = types_1.BookCategory.FiccaoCientifica;
                break;
            case 4:
                category = types_1.BookCategory.Biografia;
                break;
            case 5:
                category = types_1.BookCategory.Historia;
                break;
            case 6:
                category = types_1.BookCategory.Tecnologia;
                break;
            case 7:
                category = types_1.BookCategory.Terror;
                break;
            case 8:
                category = types_1.BookCategory.Outro;
                break;
            default:
                console.log("Escolha uma opção válida!\n");
                continue;
        }
        break;
    }
    return category;
};
exports.getCategory = getCategory;
