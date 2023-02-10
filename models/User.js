const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    branch: {
        type: String
    }
});

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;