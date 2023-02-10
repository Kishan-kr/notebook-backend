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
        type: Date
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;