const mongoose = require('mongoose');
mongoose.set('strictQuery');
const connectedDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    }catch(e){
        console.log(e);
    }
}

module.exports = connectedDB;