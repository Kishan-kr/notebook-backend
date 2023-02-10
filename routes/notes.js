const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

// Route 1: Adding a new note
router.post('/addnote', [
    // validating notes 
    body('title', 'Minimum length of title must be 3').isLength({ min: 3 }),
    body('description', 'Minimum length must be 3').isLength({ min: 3 })
], fetchUser, async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // sending errors as response if available 
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // Destructuring subject,title,body from req.body 
    const { title, description, tag } = req.body;

    try {
        // Creating new Note and sending OK response
        const notes = new Note({ user: req.user.id, title, description, tag, createdOn: Date.now() })
        await notes.save();
        success = true;
        res.status(200).json({success, notes});

    } catch (error) {
        console.log(error);
        res.status(500).json({success, error:'Internal server error occured'});
    }
})

// Route 2: Fetching all note
router.get('/getnote', fetchUser, async (req, res) => {
    const user = req.user.id;

    try {
        // Finding all notes from user id and sending all notes as response
        const notes = await Note.find({ user: user });
        if (!notes) {
            return res.status(200).send('You do not have any notes, Please add some')
        }
        res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Route 3: Updating a Note using PUT request
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    let success = false;
    const user = req.user.id;
    const { title, description, tag } = req.body;
    let newNote = {};
    try {
        let existNote = await Note.findById(req.params.id);
        if (!existNote) {
            return res.status(404).json({success,error:'Not found'});
        }
        // checking if the note owned by same user 
        if (user !== existNote.user.toString()) {
            return res.status(401).json({success,error:'Not Allowed'});
        }
        // storing only those fields which are available in request 
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }
        success = true;
        // Updating note 
        newNote = await Note.findByIdAndUpdate(req.params.id, newNote,{new:true})
        res.status(200).json({ success, newNote });

    } catch (error) {
        console.log(error);
        res.status(500).json({success,error:'Internal server error occured'});
    }
})

// Route 4: Deleting a NOte using DELETE request
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    let success = false;
    const user = req.user.id;
    try {
        let existNote = await Note.findById(req.params.id);
        if (!existNote) {
            return res.status(404).json({success,error:'Not found'});
        }
        // checking if the note owned by same user 
        if (user !== existNote.user.toString()) {
            return res.status(401).json({success,error:'Not Allowed'});
        }
        success = true;
        // Deleting note 
        await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({ success, msg: 'Your note has been deleted successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({success,error:'Internal server error occured'});
    }
})

module.exports = router;