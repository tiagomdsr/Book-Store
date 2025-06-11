import { pool } from "../database/connection";
import createPrompt from "prompt-sync";
import { QueryResult } from "pg";

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
    
    const name: string = prompt("Digite o nome da editora: ");
    const address: string = prompt("Digite o endereço da editora: ");
    let phone: number;

    while (true) {
        phone = Number(prompt("Digite o número de telefone da editora: "));
        
        if(Number(phone)) {
            break;
        }

        console.log("\nDigite um telefone válido.\n");
    }

    const phoneString: string = phone.toString();
    
    const publisher: Publisher = new Publisher(name, address, phoneString);

    return publisher.toObject();
}

async function addPublisher(publisher: TypePublisher) {
    try {
        const res: QueryResult<TypePublisher> = await pool.query(
            "INSERT INTO livraria.editoras(nome, endereco, telefone) VALUES ($1, $2, $3) RETURNING *;",
            [publisher.name, publisher.address, publisher.phone]
        );

        console.clear();
        console.log(`Editora "${publisher.name}" adicionado(a) com sucesso!\n`);
        console.log(res.rows);        
    } catch (err) {
        console.log("Erro:", err);
    }
}

async function menuPublisher(): Promise<void> {
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            "1 - Listar todas as editoras.",
            "",
            "2 - Buscar editora por nome.",
            "",
            "0 - Voltar ao menu principal",
            "",  
        ].join("\n"));

        const choice: number = Number(prompt("Escolha: "))

        switch(choice) {
            case 0:
                menu = false;

                break;
            case 1:
                console.clear();
                const publishers: TypePublisher[] = await getAllPublishers();

                console.log("Editoras: ");
                console.log(publishers);
                prompt("\nAperte enter para voltar ao menu\n");

                break;
            case 2:
                console.clear();
                const name: string = prompt("Digite o nome da editora que deseja buscar: ");
                
                await getPublishers(name);
                prompt("\nAperte enter para voltar ao menu\n");
                
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
            console.log("Nenhuma editora cadastrada");
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("Erro:", err);
        return [];
    }
}

async function getPublishers(search: string): Promise<void> {
    try {
        const res: QueryResult<TypePublisher> = await pool.query(`SELECT ${publisherConvertTypeKeys} FROM livraria.editoras WHERE nome ILIKE $1`, [`%${search}%`]);

        if (res.rows.length === 0) {
            console.clear();
            console.log(`Nenhuma editora com o nome "${search}" encontrada.`)
        } else {
            console.log(`Editoras com o nome "${search}": `);
            console.log(res.rows);
        }
    } catch (err: any) {
        console.log("Erro:", err);
    }
}

export { buildPublisher, addPublisher, menuPublisher, getAllPublishers };