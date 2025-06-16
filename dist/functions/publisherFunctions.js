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
exports.buildPublisher = buildPublisher;
exports.addPublisher = addPublisher;
exports.menuPublisher = menuPublisher;
exports.getAllPublishers = getAllPublishers;
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const chalk_1 = __importDefault(require("chalk"));
const connection_1 = require("../database/connection");
const Publisher_1 = require("../models/Publisher");
const prompt = (0, prompt_sync_1.default)();
const publisherConvertTypeKeys = `
                        id_editora AS "publisherId",
                        nome AS name,
                        endereco AS address,
                        telefone AS phone
`;
function buildPublisher() {
    console.clear();
    const name = prompt(chalk_1.default.blue("Digite o nome da editora: "));
    const address = prompt(chalk_1.default.blue("Digite o endereço da editora: "));
    let phone;
    while (true) {
        phone = Number(prompt(chalk_1.default.blue("Digite o número de telefone da editora: ")));
        if (Number(phone)) {
            break;
        }
        console.log(chalk_1.default.red("\nDigite um telefone válido.\n"));
    }
    const phoneString = phone.toString();
    const publisher = new Publisher_1.Publisher(name, address, phoneString);
    return publisher.toObject();
}
function addPublisher(publisher) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.pool.query("INSERT INTO livraria.editoras(nome, endereco, telefone) VALUES ($1, $2, $3) RETURNING *;", [publisher.name, publisher.address, publisher.phone]);
            console.clear();
            console.log(`Editora "${chalk_1.default.blue(publisher.name)}" adicionado(a) com sucesso!\n`);
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
        }
    });
}
function menuPublisher() {
    return __awaiter(this, void 0, void 0, function* () {
        let menu = true;
        while (menu) {
            console.clear();
            console.log([
                chalk_1.default.blueBright("=================== BUSCAR EDITORA ===================="),
                "",
                `${chalk_1.default.blue("1")} - Listar todas as editoras.`,
                "",
                `${chalk_1.default.blue("2")} - Buscar editora por nome.`,
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
                    const publishers = yield getAllPublishers();
                    console.log(chalk_1.default.blueBright("Editoras:"));
                    printPublishers(publishers);
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                case 2:
                    console.clear();
                    const name = prompt(chalk_1.default.blue("Digite o nome da editora que deseja buscar: "));
                    console.clear();
                    console.log(`Editoras com o nome "${chalk_1.default.blue(name)}":`);
                    printPublishers(yield getPublishers(name));
                    prompt(chalk_1.default.blue("\nAperte enter para voltar ao menu\n"));
                    break;
                default:
                    console.log("\nOpção inválida\n");
            }
        }
    });
}
function getAllPublishers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${publisherConvertTypeKeys} FROM livraria.editoras;`);
            if (res.rows.length === 0) {
                console.clear();
                console.log(chalk_1.default.red("Nenhuma editora cadastrada"));
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log(chalk_1.default.red("Erro:"), err);
            return [];
        }
    });
}
function getPublishers(search) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield connection_1.pool.query(`SELECT ${publisherConvertTypeKeys} FROM livraria.editoras WHERE nome ILIKE $1`, [`%${search}%`]);
            if (res.rows.length === 0) {
                console.clear();
                console.log("\n=================================================\n");
                console.log(chalk_1.default.red(`Nenhuma editora com o nome "${search}" encontrada.`));
                return [];
            }
            else {
                return res.rows;
            }
        }
        catch (err) {
            console.log("\n=================================================\n");
            console.log(chalk_1.default.red("Erro:", err));
            return [];
        }
    });
}
function printPublishers(publishers) {
    for (const publisher in publishers) {
        console.log("\n=================================================\n");
        console.log(`${chalk_1.default.blue("Nome:")} ${publishers[publisher].name}.\n${chalk_1.default.blue("telefone:")} ${publishers[publisher].phone}\n${chalk_1.default.blue("endereço:")} ${publishers[publisher].address}`);
    }
    console.log("\n=================================================\n");
}
