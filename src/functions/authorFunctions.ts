import { QueryResult } from "pg";
import createPrompt from "prompt-sync";
import EmailValidator from "email-validator";
import chalk from "chalk"

import { pool } from "../database/connection";
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
    
    const name: string = prompt(chalk.blue("Digite o nome do(a) autor(a): "));
    let email: string;

    while (true) {
        email = prompt(chalk.blue("Digite o email do(a) autor(a): "));
        
        if (EmailValidator.validate(email)) {
            break;
        }

        console.log(chalk.red("\nDigite um email válido.\n"));
    }

    let phone: number;
    
    while (true) {
        phone = Number(prompt(chalk.blue("Digite o telefone do(a) autor(a): ")));

        if (Number(phone)) {
            break;
        }

        console.log(chalk.red("\nDigite um telefone válido.\n"));
    }

    const phoneString: string = phone.toString();

    const bio: string = prompt(chalk.blue("Digite uma breve biografia do(a) autor(a): ")); 
    
    const author: Author = new Author(name, email, phoneString, bio);

    return author.toObject();
}

async function addAuthor(author: TypeAuthor): Promise<void>{
    try {
        await pool.query(
            "INSERT INTO livraria.autores(nome, email, telefone, bio) VALUES ($1, $2, $3, $4) RETURNING *;",
            [author.name, author.email, author.phone, author.bio]
        );

        console.clear();
        console.log(`Autor(a) "${chalk.blue(author.name)}" adicionado(a) com sucesso!\n`);    
    } catch (err) {
        console.log(chalk.red("Erro:"), err);
    }
}

async function menuAuthor(): Promise<void> {
    let menu: boolean = true;

    while(menu) {
        console.clear();

        console.log([
            chalk.blueBright("=================== BUSCAR AUTOR ===================="),
            "",
            `${chalk.blue("1")} - Listar todos os autores.`,
            "",
            `${chalk.blue("2")} - Buscar autor por nome.`,
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
                const authors: TypeAuthor[] = await getAllAuthors();
                
                console.log(chalk.blueBright("Autores: "));

                printAuthors(authors);

                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));

                break;
            case 2:
                console.clear();
                const name: string = prompt(chalk.blue("Digite o nome do(a) autor(a) que deseja buscar: "));
                
                console.clear();

                console.log(`Autores com o nome "${chalk.blue(name)}":`);
                printAuthors(await getAuthors(name));
                prompt(chalk.blue("\nAperte enter para voltar ao menu\n"));
                
                break;
            default:
                console.log(chalk.red("\nOpção inválida\n"));
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

async function getAuthors(search: string): Promise<TypeAuthor[]> {
    try {
        const res: QueryResult<TypeAuthor> = await pool.query(`SELECT ${authorConvertTypeKeys} FROM livraria.autores WHERE nome ILIKE $1;`, [`%${search}%`]);

        if (res.rows.length === 0) {
            console.clear();
            console.log("\n=================================================\n");
            console.log(chalk.red(`Nenhum(a) autor(a) com o nome "${search}" encontrado(a).`));
            return [];
        } else {
            return res.rows;
        }
    } catch (err: any) {
        console.log("\n=================================================\n");
        console.log("Erro:", err);
        return [];
    }
}

function printAuthors(authors: TypeAuthor[]): void {
    for (const author in authors) {
        console.log("\n=================================================\n");
        console.log(`${chalk.blue("Nome:")} ${authors[author].name}.\n${chalk.blue("Bio:")} ${authors[author].bio}\n${chalk.blue("telefone:")} ${authors[author].phone} | ${chalk.blue("email:")} ${authors[author].email}`);
    }

    console.log("\n=================================================\n");
}

export { buildAuthor, addAuthor, menuAuthor, getAllAuthors, printAuthors };