const mongodb = require("./mongodb");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const bp = require("body-parser");

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

register = async (event)=>{
    let hash = bcrypt.hashSync(event.password, 10);
    let user = {
        username : event.username,
        hash : hash
    }
    let res = await mongodb.insert(user);
    return res;
}

app.post("/",async (req, res)=>{
    try{
        let status = await register(req.body);
        res.status(status.statusCode).send(status.body);
    }catch(err){
        res.status(500).send("Error en el servidor");
    }
});

const port = 8080;
app.listen(port,()=>{
    console.log("Register service up and ready!")
});

