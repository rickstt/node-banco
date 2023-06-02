//Importação do módulo gerenciador de ambiente
require("dotenv").config();

//importar o express
const express = require("express");

//Importar o módulo mysql
const mysql = require("mysql2");

//Instância do express representada por app
const app = express();

//Ativar a manipulação de dados em json
app.use(express.json());

/* ----------------------- BANCO DE DADOS --------------------------
    Configurar a conexão com banco de dados MySQL passando:
    - host (Servidor do banco de dados)
    - Nome de usuário
    - Nome do banco
    - Senha
    - Porta de comunicação
*/
const con = mysql.createConnection({
    host: process.env.HOST_DB,
    database: process.env.NAME_DB,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    port: process.env.PORT_DB
})

/* Para ativar a conexão com o banco de dados iremos usar o comando connect.
Este comando possui um callback que verifica se houve ou não algum erro na conexão
com o banco de dados.*/
con.connect((erro) => {
    if (erro) {
        return console.error(`Unexpected error at connection -> ${erro}`)
    }
    console.log(`Connection stabilized ${con.threadId}`)
})

//Primeira rota para listar os usuários
app.get("/users/list", (req, res) => {
    //Vamos executar uma consulta sql para selecionar todos os usuários
    con.query("SELECT * FROM usuario", (error, result) => {
        if (!error)
            return res.status(200).send({ output: `Ok`, data: result });
        else return res.status(500).send({ output: `Internal error during request process`, erro: error });

    })
});


//Nova rota para criar novos usuários
app.post("/users/insert", (req, res) => {
    con.query("INSERT INTO usuario SET ?", [req.body], (error, result) => {
        if (!error)
            return res.status(201).send({ output: `Inserted`, data: result });
        else return res.status(500).send({ output: `Internal error during request process`, erro: error });
    })
})

//Vamos definir a porta de comunicação
app.listen(process.env.PORT, () => console.log(
    `Server online at: ${process.env.HOST}:${process.env.PORT}`
));