let mongoose = require('mongoose');
require('dotenv').config();

module.exports= ()=>{
    console.log("entering the init funciton", process.env.MONGO_URI, process.env.MONGO_DB)
    mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB,
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log("mongo db connected");
})
mongoose.connection.on('error', (err)=>{
    console.error("error occurred while connecting to the mongo db", err);
})
mongoose.connection.on('disconnected', ()=>{
    console.error("mongo connection disconnected");
})

process.on('SININT', ()=>{
    mongoose.connection.close(()=>{
        console.log("mongo connection closed due to termination of the application");
    });
})
};
