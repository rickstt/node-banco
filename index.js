//Importação do módulo gerenciador de ambiente
require("dotenv").config();

//importar o express
const express = require("express");

//Importar o módulo mysql
const mysql = require("mysql2");

//Importar o módulo do bcrypt para criptografia de senha
const bcrypt = require("bcrypt");

/* ----------------------- Warning ---------------------------------
Apesar de aceitar uma String, havia um erro na criptografia da senha que foi resolvido da seguinte maneira:
É preciso converter a quantidade de rounds que estamos passando via env para número. Pois quando passamos com o env,
Ele é interpretado como String, e o bcrypt não está conseguindo reconhecer o valor. Então para resolver o problema
foi criada uma constante de saltos que teve seu valor convertido para int.
*/
const salt = parseInt(process.env.SALT);

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
    //Vamos pegar a senha digitada pelo usuário (FRONT)
    let sh = req.body.senha;
    //Realizar a criptograia da senha para então cadastrar no banco
    bcrypt.hash(sh, salt, (error, result) => {
        if (!error) {
            //Devolver a senha porém agora criptografada
            req.body.senha = result
            con.query("INSERT INTO usuario SET ?", [req.body], (error, result) => {
                if (!error)
                    return res.status(201).send({ output: `Inserted`, data: result });
                else return res.status(500).send({ output: `Internal error during request process`, erro: error });
            });
        }
        else return res.status(500).send({ output: `Unexpected internal error in password`, erro: error });
    });
});

//Criação da rota de atualização de dados
app.put("/users/update/:id", (req, res) => {
    let sh = req.body.senha;

    bcrypt.hash(sh, salt, (error, result) => {
        if (!error) {
            req.body.senha = result
            con.query("UPDATE usuario SET ? WHERE idusuario=?", [req.body, req.params.id], (error, result) => {
                if (!error)
                    return res.status(202).send({ output: `Updated`, data: result });
                else return res.status(500).send({ output: `Internal error during request process`, erro: error });
            });
        }
        else return res.status(500).send({ output: `Unexpected internal error in password`, erro: error });
    });
});

//Vamos definir a porta de comunicação
app.listen(process.env.PORT, () => console.log(
    `Server online at: ${process.env.HOST}:${process.env.PORT}`
));