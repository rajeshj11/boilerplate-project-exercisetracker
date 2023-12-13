let express = require('express');
let moment = require('moment');
let userModel = require('../models/users');
let exerciseModel = require('../models/exercise');
let router = express.Router();

router.post('/', async (req, res, next) => {
    // Your asynchronous logic here
    console.log("entering the post alos")
    try{
        let user = new userModel(req.body);
        let result = await user.save();
        let {username, _id}= result;
        res.json({username, _id});
    }catch(err){
        next(err);
    }
});

router.get('/', async(req, res, next)=>{
    try{
        let {id, limit} = req.query;
        let query = {};
        if(id){
            query._id= id;
        }
        console.log("query", query, JSON.stringify(query));
        let result
        if(limit){
            result = await userModel.find(query).limit(limit)
        }else {
            result = await userModel.find(query);
        }
        
        res.json(result);
    }catch(err){
        next(err);
    }
});

router.get('/:_id/logs', async(req, res, next)=>{
    try{
        let {_id} = req.params;
        let {from, to, limit} = req.query;
        from = from ?  moment(from).startOf('day').toDate(): from ;
        to = to ?  moment(to).endOf('day').toDate(): to;
        let userQuery = {_id:_id};
        let query = {user_id: _id};
        if(from && to ){
            query.date= {$gte:from ,$lte:to};
        }
        console.log("query", query, JSON.stringify(query));
        let logs = []
        let user = await userModel.findOne(userQuery).select('username _id').lean();
        if(!user){
            next('no user found!');
        }
        if(limit){
            logs = await exerciseModel.find(query).select('description duration date').limit(limit).lean()
        }else {
            logs = await exerciseModel.find(query).select('description duration date').lean();
        }
        let finalResult = {
            ...user,
            count: logs.length,
            log: logs.map((log)=>{
                delete log._id;
                log.date = new Date(log.date).toDateString();
                return log;
                })
        };
        res.json(finalResult);
    }catch(err){
        next(err);
    }
});

router.post('/:_id/exercises', async (req, res, next) => {
    // Your asynchronous logic here
    try{
        let {_id} = req.params;
        let {':_id':user_id, description, duration, date} = req.body;
        let user = await userModel.findById(_id).select('username _id').lean();
        if(!user){
            next('user not found');
        }
        let obj = {user_id, description, duration}
        obj.user_id||= _id;
        if(date){
            obj.date = new Date(date);
        }
        let exercise = new exerciseModel(obj);
        let result = await exercise.save();
        let finalResult = {
            ...user, 
            _id,    
            description,
            duration:result?._doc?.duration,
            date: new Date(result?._doc?.date).toDateString()
            
        };
        finalResult.date = new Date(finalResult.date).toDateString();
        res.json(finalResult);
    }catch(err){
        next(err);
    }
})
  
module.exports = router;