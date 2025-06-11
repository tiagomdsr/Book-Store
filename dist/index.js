"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const bookFunctions_1 = require("./functions/bookFunctions");
const authorFunctions_1 = require("./functions/authorFunctions");
const publisherFunctions_1 = require("./functions/publisherFunctions");
const prompt = (0, prompt_sync_1.default)();
let menu = true;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const choice = Number(prompt("Escolha: "));
            switch (choice) {
                case 0:
                    menu = false;
                    break;
                case 1:
                    yield (0, bookFunctions_1.addBook)(yield (0, bookFunctions_1.buildBook)());
                    prompt("\nAperte enter para voltar ao menu\n");
                    continue;
                case 2:
                    yield (0, bookFunctions_1.menuBook)();
                    continue;
                case 3:
                    yield (0, authorFunctions_1.addAuthor)((0, authorFunctions_1.buildAuthor)());
                    prompt("\nAperte enter para voltar ao menu\n");
                    continue;
                case 4:
                    yield (0, authorFunctions_1.menuAuthor)();
                    continue;
                case 5:
                    yield (0, publisherFunctions_1.addPublisher)((0, publisherFunctions_1.buildPublisher)());
                    prompt("\nAperte enter para voltar ao menu\n");
                    continue;
                case 6:
                    yield (0, publisherFunctions_1.menuPublisher)();
                    continue;
                default:
                    console.log("\nOpção inválida\n");
            }
        }
    });
}
main();
