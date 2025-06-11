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
const connection_1 = require("../database/connection");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const email_validator_1 = __importDefault(require("email-validator"));
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
    const name = prompt("Digite o nome do autor(a): ");
    let email;
    while (true) {
        email = prompt("Digite o email do(a) autor(a): ");
        if (email_validator_1.default.validate(email)) {
            break;
        }
        console.log("\nDigite um email válido.\n");
    }
    let phone;
    while (true) {
        phone = Number(prompt("Digite o telefone do(a) autor(a): "));
        if (Number(phone)) {
            break;
        }
        console.log("\nDigite um telefone válido.\n");
    }
    const phoneString = phone.toString();
    const bio = prompt("Digite uma breve biografia do(a) autor(a): ");
    const author = new Author_1.Author(name, email, phoneString, bio);
    return author.toObject();
}
function addAuthor(author) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query("INSERT INTO livraria.autores(nome, email, telefone, bio) VALUES ($1, $2, $3, $4) RETURNING *;", [author.name, author.email, author.phone, author.bio]);
            console.clear();
            console.log(`Autor(a) "${author.name}" adicionado(a) com sucesso!\n`);
            console.log(res.rows);
        }
        catch (err) {
            console.log("Erro:", err);
        }
    });
}
function menuAuthor() {
    return __awaiter(this, void 0, void 0, function* () {
        let menu = true;
        while (menu) {
            console.clear();
            console.log([
                "1 - Listar todos os autores.",
                "",
                "2 - Buscar autor por nome.",
                "",
                "0 - Voltar ao menu principal",
                "",
            ].join("\n"));
            const choice = Number(prompt("Escolha: "));
            switch (choice) {
                case 0:
                    menu = false;
                    break;
                case 1:
                    console.clear();
                    const authors = yield getAllAuthors();
                    console.log("Autores: ");
                    console.log(authors);
                    prompt("\nAperte enter para voltar ao menu\n");
                    break;
                case 2:
                    console.clear();
                    const name = prompt("Digite o nome do(a) autor(a) que deseja buscar: ");
                    yield getAuthors(name);
                    prompt("\nAperte enter para voltar ao menu\n");
                    break;
                default:
                    console.log("\nOpção inválida\n");
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
                console.log(`Nenhum(a) autor(a) com o nome "${search}" encontrado(a).`);
            }
            else {
                console.log(`Autores com o nome "${search}": `);
                console.log(res.rows);
            }
        }
        catch (err) {
            console.log("Erro:", err);
        }
    });
}
