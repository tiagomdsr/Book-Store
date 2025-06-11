import { pool } from "../database/connection";
import createPrompt from "prompt-sync";
import EmailValidator from "email-validator";
import { QueryResult } from "pg";

import { TypeAuthor } from "../types"
import { Author } from "../models/Author";

const prompt = createPrompt();

const authorConvertTypeKeys: string = `
                        id_autor AS "authorId",
                        nome AS name,
                        email,
                        telefone AS phone,
                        bio
`;

function buildAuthor(): TypeAuthor{
    console.clear();
    
    const name: string = prompt("Digite o nome do autor(a): ");
    let email: string;

    while (true) {
        email = prompt("Digite o email do(a) autor(a): ");
        
        if (EmailValidator.validate(email)) {
            break;
        }

        console.log("\nDigite um email válido.\n");
    }

    let phone: number;
    
    while (true) {
        phone = Number(prompt("Digite o telefone do(a) autor(a): "));

        if (Number(phone)) {
            break;
        }

        console.log("\nDigite um telefone válido.\n");
    }

    const phoneString: string = phone.toString();

    const bio: string = prompt("Digite uma breve biografia do(a) autor(a): "); 
    
    const author: Author = new Author(name, email, phoneString, bio);

    return author.toObject();
}

async function addAuthor(author: TypeAuthor): Promise<void>{
    try {
        const res: QueryResult<TypeAuthor> = await pool.query(
            "INSERT INTO livraria.autores(nome, email, telefone, bio) VALUES ($1, $2, $3, $4) RETURNING *;",
            [author.name, author.email, author.phone, author.bio]
        );

        console.clear();
        console.log(`Autor(a) "${author.name}" adicionado(a) com sucesso!\n`);
        console.log(res.rows);        
    } catch (err) {
        console.log("Erro:", err);
    }
}

async function menuAuthor(): Promise<void> {
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            "1 - Listar todos os autores.",
            "",
            "2 - Buscar autor por nome.",
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
                const authors: TypeAuthor[] = await getAllAuthors();
                
                console.log("Autores: ");
                console.log(authors);
                prompt("\nAperte enter para voltar ao menu\n");

                break;
            case 2:
                console.clear();
                const name: string = prompt("Digite o nome do(a) autor(a) que deseja buscar: ");
                
                await getAuthors(name);
                prompt("\nAperte enter para voltar ao menu\n");
                
                break;
            default:
                console.log("\nOpção inválida\n");
        }
    }
}

async function getAllAuthors(): Promise<TypeAuthor[]> {
    try {
        const res: QueryResult<TypeAuthor> = await pool.query(`SELECT ${authorConvertTypeKeys} FROM livraria.autores;`);

        if (res.rows.length === 0) {
            console.clear();
            console.log("Nenhum autor cadastrado");
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("Erro:", err);
        return [];
    }    
}

async function getAuthors(search: string): Promise<void> {
    try {
        const res: QueryResult<TypeAuthor> = await pool.query(`SELECT ${authorConvertTypeKeys} FROM livraria.autores WHERE nome ILIKE $1;`, [`%${search}%`]);

        if (res.rows.length === 0) {
            console.clear();
            console.log(`Nenhum(a) autor(a) com o nome "${search}" encontrado(a).`);
        } else {
            console.log(`Autores com o nome "${search}": `);
            console.log(res.rows);
        }
    } catch (err: any) {
        console.log("Erro:", err);
    }
}

export { buildAuthor, addAuthor, menuAuthor, getAllAuthors };