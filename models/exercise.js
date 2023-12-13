const {mongoose, Schema} = require('mongoose');

let exerciseSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    duration:{
        type: Number
    },
    date:{
        type: Date,
        default: Date.now
    }
});

let exerciseModel = mongoose.model('exercises', exerciseSchema);

module.exports=exerciseModel;

