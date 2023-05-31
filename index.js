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

//Primeira rota para listar os usuários
app.get("/users/list", (req,res) => {
    res.status(200).send({ output: `Veja o resultado` });
});

//Vamos definir a porta de comunicação
app.listen(process.env.PORT, () => console.log(`Server online at: ${process.env.HOST}:${process.env.PORT}`));