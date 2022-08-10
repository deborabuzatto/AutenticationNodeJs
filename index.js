const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const host = '127.0.0.1';
const port = '3000';
const url = `http://${host}:${port}`;
var path = require('path');

const db = mongoose.connection;
db.on('error', (err)=> console.log(err));
db.once('open', ()=> console.log('Banco de dados conectado'));
mongoose.connect('mongodb://127.0.0.1/loginDB')

app.use(session({secret:'abacaxi'}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/css'));
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({extended:true}));



app.get('/', (req, res)=>{
    try{
        res.render ('formulario');
        console.log('Formulário renderizado com sucesso');
        res.end()
    }catch(err){
        console.log('error');
        res.send('Estamos em manutenção');
        console.log('Falha na renderização');
    }
});

app.post('/result', result = (req, res, next)=>{
    try{
        var username = req.body.login;
        var password = req.body.senha;
        res.send(`Login: ${username} Senha: ${password}`);
            mongoose.connect('mongodb://127.0.0.1/loginDB', function(err, db){
                if(err){
                    throw err;
                }
                db.collection('usuarios').find().toArray(function(err, result){
                    if(err){
                        throw err;
                    }
                    console.log(result);;
                    var count = Object.keys(result).length;
                    console.log(count);
                    var i=0;
                    for(i = 0; i<count; i++){
                        nomeUsuario = result[i].nome;
                        senhaUsuario = result[i].senha;
                        if(nomeUsuario == username && senhaUsuario == password){
                            console.log('Autenticação permitida')
                            res.render("pagina")
                            
                            
                        }else{
                            console.log('Autenticação negada')
                        }
                    }
                })
        })

    }catch(err) {
        res.send('Ocorreu um erro na autenticação');
        console.log('Ocorreu um erro na autenticação');
    }
})


app.listen(port, host, ()=>{
    console.log(`Servidor rondando em ${url}`)
});

