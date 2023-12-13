'strict mode'
let userModel = require('../models/users');



module.exports = (app)=>{
    app.get('/api/getusers', async(req, res, next)=>{
        try{
            let result = await userModel.find().select('username _id').lean();
            res.json(result);
        }catch(err){
            next(err);
        }
    })
    app.get('/api/getuser', async(req, res, next)=>{
        try{
            let result = await userModel.find().select('username _id').lean();
            res.json(result);
        }catch(err){
            next(err);
        }
    })
}