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
exports.buildAuthor = buildAuthor;
exports.addAuthor = addAuthor;
exports.menuAuthor = menuAuthor;
exports.getAllAuthors = getAllAuthors;
exports.printAuthors = printAuthors;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const email_validator_1 = __importDefault(require("email-validator"));
const chalk_1 = __importDefault(require("chalk"));
const connection_1 = require("../database/connection");
const Author_1 = require("../models/Author");
const prompt = (0, prompt_sync_1.default)();
const authorConvertTypeKeys = `
                        id_autor AS "authorId",
                        nome AS name,
                        email,
                        telefone AS phone,
                        bio
`;
function buildAuthor() {
    console.clear();
    const name = prompt(chalk_1.default.blue("Digite o nome do(a) autor(a): "));
    let email;
    while (true) {
        email = prompt(chalk_1.default.blue("Digite o email do(a) autor(a): "));
        if (email_validator_1.default.validate(email)) {
            break;
        }
        console.log(chalk_1.default.red("\nDigite um email válido.\n"));
    }
    let phone;
    while (true) {
        phone = Number(prompt(chalk_1.default.blue("Digite o telefone do(a) autor(a): ")));
        if (Number(phone)) {
            break;
        }
        console.log(chalk_1.default.red("\nDigite um telefone válido.\n"));
    }
    const phoneString = phone.toString();
    const bio = prompt(chalk_1.default.blue("Digite uma breve biografia do(a) autor(a): "));
    const author = new Author_1.Author(name, email, phoneString, bio);
    return author.toObject();
}
function addAuthor(author) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.pool.query("INSERT INTO livraria.autores(nome, email, telefone, bio) VALUES ($1, $2, $3, $4) RETURNING *;", [author.name, author.email, author.phone, author.bio]);
            console.clear();
            console.log(`Autor(a) "${chalk_1.default.blue(author.name)}" adicionado(a) com sucesso!\n`);
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
        }
    });
}
function menuAuthor() {
    return __awaiter(this, void 0, void 0, function* () {
        let menu = true;
        while (menu) {
            console.clear();
            console.log([
                chalk_1.default.blueBright("=================== BUSCAR AUTOR ===================="),
                "",
                `${chalk_1.default.blue("1")} - Listar todos os autores.`,
                "",
                `${chalk_1.default.blue("2")} - Buscar autor por nome.`,
                "",
                `${chalk_1.default.red("0")} - Voltar ao menu principal`,
                "",
            ].join("\n"));
            const choice = Number(prompt(chalk_1.default.blue("Escolha: ")));
            switch (choice) {
                case 0:
                    menu = false;
                    break;
                case 1:
                    console.clear();
                    const authors = yield getAllAuthors();
                    console.log(chalk_1.default.blueBright("Autores: "));
                    printAuthors(authors);
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                case 2:
                    console.clear();
                    const name = prompt(chalk_1.default.blue("Digite o nome do(a) autor(a) que deseja buscar: "));
                    console.clear();
                    console.log(`Autores com o nome "${chalk_1.default.blue(name)}":`);
                    printAuthors(yield getAuthors(name));
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                default:
                    console.log(chalk_1.default.red("\nOpção inválida\n"));
            }
        }
    });
}
function getAllAuthors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${authorConvertTypeKeys} FROM livraria.autores;`);
            if (res.rows.length === 0) {
                console.clear();
                console.log("Nenhum autor cadastrado");
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log("Erro:", err);
            return [];
        }
    });
}
function getAuthors(search) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${authorConvertTypeKeys} FROM livraria.autores WHERE nome ILIKE $1;`, [`%${search}%`]);
            if (res.rows.length === 0) {
                console.clear();
                console.log("\n=================================================\n");
                console.log(chalk_1.default.red(`Nenhum(a) autor(a) com o nome "${search}" encontrado(a).`));
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log("\n=================================================\n");
            console.log("Erro:", err);
            return [];
        }
    });
}
function printAuthors(authors) {
    for (const author in authors) {
        console.log("\n=================================================\n");
        console.log(`${chalk_1.default.blue("Nome:")} ${authors[author].name}.\n${chalk_1.default.blue("Bio:")} ${authors[author].bio}\n${chalk_1.default.blue("telefone:")} ${authors[author].phone} | ${chalk_1.default.blue("email:")} ${authors[author].email}`);
    }
    console.log("\n=================================================\n");
}
