const mysql = require('mysql2');

//configurar la conexión con la bd
const connection = mysql.createConnection({
    host:   'localhost',
    user:   'root',
    password: 'root',
    database: 'insta_pet'
})

//hacemos conexion de prueba
connection.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('connected');
});

module.exports = connection;