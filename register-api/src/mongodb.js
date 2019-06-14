const MongoClient = require("mongodb").MongoClient;
const uri="mongodb+srv://xpectrum:TzxSw9LnmT5f2GR@auth-zqaid.mongodb.net/xpectrum";
const client = new MongoClient(uri, { useNewUrlParser: true });

let connected = false;
let dbo = null;

const init = async (create)=>{
    try{
        if (!connected){
            await client.connect();
            console.log("connect****")
            if(create){
                dbo = await client.db("xpectrum");
                connected = true;
                let res = await dbo.createCollection("users");
                console.log(res);
            }
            connected=true;
        }
    }catch(err){
        console.log(err);
    }
}

let response = (code,message)=>{
    return {
        statusCode: code,
        body: message
    };
};

exports.insert = async (userdata)=>{
    try{
        await init(true);
        let user = await exports.find(userdata.username);
        if (user == null){
            await dbo.collection("users").insertOne({
                username : userdata.username,
                hash : userdata.hash
            });
            return response(200,"User registered succesfully");
        }else{
            console.log(response(400,"This username is already in use"))
            return response(400,"This username is already in use");
        }
    }catch(err){
        console.log(err);
        return response(400,err);
    }

}

exports.find = async (username)=>{
    try{
        await init(false);
        let query = { username : username};
        let userArray = await dbo.collection("users").find(query).toArray();
        let length = userArray.length;
        return length == 1 ? userArray[0] : null;
    }catch(err){
        console.log(err);
        return null;
    }
}

