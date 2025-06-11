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
const authorFunctions_1 = require("./functions/authorFunctions");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
//addAuthor(buildAuthor());
//console.log(buildAuthor());
//menuBook();
//getAllPublishers();
// menuPublisher();
// console.log(buildPublisher());
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let authorId;
        let teste;
        while (true) {
            let allAuthorsIds = [];
            const authorsList = yield (0, authorFunctions_1.getAllAuthors)();
            console.clear();
            for (const author in authorsList) {
                console.log(`${authorsList[author].authorId} - ${authorsList[author].name}.`);
                allAuthorsIds.push(Number(authorsList[author].authorId));
            }
            ;
            console.log("\n0 - Adicionar um(a) novo(a) autor(a).\n");
            console.log("Digite o número do(a) autor(a) do livro, ou crie um(a) novo(a) se não existir na lista: \n");
            const option = Number(prompt("Escolha: "));
            const validOption = allAuthorsIds.includes(option);
            if (option === 0) {
                teste = (0, authorFunctions_1.buildAuthor)();
                continue;
            }
            else if (!validOption) {
                console.log("\nDigite um autor válido\n");
                console.log(validOption);
                console.log(allAuthorsIds);
                continue;
            }
            authorId = option;
            break;
        }
        console.log(authorId);
        console.log(teste);
    });
}
main();
