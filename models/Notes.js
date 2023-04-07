const mongoose = require('mongoose');
const {Schema} = mongoose;

const NoteSchema = new Schema({
    // giving user id from 'User' model it works like foreign key in SQL
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    color: {
        bg: {
            type: String,
            default: '#FFFFFF'
        },
        fg: {
            type: String,
            default: 'dark'
        }
    },
    expireAt: {
        type: Date,
    },
    trashed: {
        type: Boolean,
        default: false
    }
})
.index({
    "expireAt": 1 }, { 
    expireAfterSeconds: 0
} ); /*expire after 2592000=30 days*/ 


const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;