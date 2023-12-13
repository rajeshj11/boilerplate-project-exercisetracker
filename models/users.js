const {mongoose, Schema} = require('mongoose');

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

let userModel = mongoose.model('track_users', userSchema);

module.exports=userModel;