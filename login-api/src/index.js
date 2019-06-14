const mongodb = require("./mongodb");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const bp = require("body-parser");

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

let response = (code,message)=>{
    return {
        statusCode: code,
        body: JSON.stringify(message)
    };
};

login = async (event)=>{
    let user = await mongodb.find(event.username);
    if (user !== null){
        let hash = bcrypt.hashSync(event.password, 10);
        let match = bcrypt.compareSync(password,hash);
        return match ? response(200,"Login successful") : response(401,"Password incorrect");
    }else{
        return response(404,"User not found");
    }
}

app.post("/",async (req, res)=>{
    try{
        let status = await login(req.body);
        res.status(status.statusCode).send(status.body);
    }catch(err){
        res.status(500).send("Error en el servidor");
    }
});

const port = 8080;
app.listen(port,()=>{
    console.log("Login service up and ready!")
});