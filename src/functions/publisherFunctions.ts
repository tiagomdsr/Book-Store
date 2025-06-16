import { QueryResult } from "pg";
import createPrompt from "prompt-sync";
import chalk from "chalk";

import { pool } from "../database/connection";
import { TypePublisher } from "../types";
import { Publisher } from "../models/Publisher"

const prompt = createPrompt();

const publisherConvertTypeKeys = `
                        id_editora AS "publisherId",
                        nome AS name,
                        endereco AS address,
                        telefone AS phone
`;

function buildPublisher(): TypePublisher {
    console.clear();
    
    const name: string = prompt(chalk.blue("Digite o nome da editora: "));
    const address: string = prompt(chalk.blue("Digite o endereço da editora: "));
    let phone: number;

    while (true) {
        phone = Number(prompt(chalk.blue("Digite o número de telefone da editora: ")));
        
        if(Number(phone)) {
            break;
        }

        console.log(chalk.red("\nDigite um telefone válido.\n"));
    }

    const phoneString: string = phone.toString();
    
    const publisher: Publisher = new Publisher(name, address, phoneString);

    return publisher.toObject();
}

async function addPublisher(publisher: TypePublisher) {
    try {
        await pool.query(
            "INSERT INTO livraria.editoras(nome, endereco, telefone) VALUES ($1, $2, $3) RETURNING *;",
            [publisher.name, publisher.address, publisher.phone]
        );

        console.clear();
        console.log(`Editora "${chalk.blue(publisher.name)}" adicionado(a) com sucesso!\n`);      
    } catch (err) {
        console.log(chalk.red("Erro:"), err);
    }
}

async function menuPublisher(): Promise<void> {
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            chalk.blueBright("=================== BUSCAR EDITORA ===================="),
            "",
            `${chalk.blue("1")} - Listar todas as editoras.`,
            "",
            `${chalk.blue("2")} - Buscar editora por nome.`,
            "",
            `${chalk.red("0")} - Voltar ao menu principal`,
            "",  
        ].join("\n"));

        const choice: number = Number(prompt(chalk.blue("Escolha: ")));

        switch(choice) {
            case 0:
                menu = false;

                break;
            case 1:
                console.clear();
                const publishers: TypePublisher[] = await getAllPublishers();

                console.log(chalk.blueBright("Editoras:"));
                printPublishers(publishers);
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));

                break;
            case 2:
                console.clear();
                const name: string = prompt(chalk.blue("Digite o nome da editora que deseja buscar: "));

                console.clear();
                
                console.log(`Editoras com o nome "${chalk.blue(name)}":`);
                printPublishers(await getPublishers(name));
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));
                
                break;
            default:
                console.log("\nOpção inválida\n");
        }
    }
}

async function getAllPublishers(): Promise<TypePublisher[]> {
    try {
        const res: QueryResult<TypePublisher> = await pool.query(`SELECT ${publisherConvertTypeKeys} FROM livraria.editoras;`);

        if (res.rows.length === 0) {
            console.clear();
            console.log(chalk.red("Nenhuma editora cadastrada"));
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log(chalk.red("Erro:"), err);
        return [];
    }
}

async function getPublishers(search: string): Promise<TypePublisher[]> {
    try {
        const res: QueryResult<TypePublisher> = await pool.query(`SELECT ${publisherConvertTypeKeys} FROM livraria.editoras WHERE nome ILIKE $1`, [`%${search}%`]);

        if (res.rows.length === 0) {
            console.clear();
            console.log("\n=================================================\n");
            console.log(chalk.red(`Nenhuma editora com o nome "${search}" encontrada.`));
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("\n=================================================\n");
        console.log(chalk.red("Erro:", err));
        return [];
    }
}

function printPublishers(publishers: TypePublisher[]): void {
    for (const publisher in publishers) {
        console.log("\n=================================================\n");
        console.log(`${chalk.blue("Nome:")} ${publishers[publisher].name}.\n${chalk.blue("telefone:")} ${publishers[publisher].phone}\n${chalk.blue("endereço:")} ${publishers[publisher].address}`);
    }

    console.log("\n=================================================\n");
}

export { buildPublisher, addPublisher, menuPublisher, getAllPublishers };