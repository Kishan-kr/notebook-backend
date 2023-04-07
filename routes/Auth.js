const express = require('express')
const Router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const jwtSecret = process.env.JWT_TOKEN_SECRET;

// Route 1: End point for creating new user 
Router.post('/createuser', [
    // validating user info 
    body('name', 'Name is not valid').isLength({ min: 3 }),
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password is too short').isLength({ min: 6 }),
    body('profession', 'Profession not provided').exists()
], async (req, res) => {
    // useful for client side 
    let success = false;
    const errors = validationResult(req);
    // sending errors as response if available 
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // checking if this email already exists in DB 
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ success, error: "User with this email is already exists" });
    }

    // generating salt and hash then User in DB 
    success = true;
    const salt = bcrypt.genSalt(10, (err, salt) => {
        const securePass = bcrypt.hash(req.body.password, salt, function (err, hash) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                profession: req.body.profession
            }).then((user) => {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const jwtToken = jwt.sign(data, jwtSecret);
                res.status(200).json({ success, jwtToken });
            });
            // res.status(200).send('You have successfully created your account');
        })
    })
})


// Route 2: Endpoint for login 
Router.post('/login', [
    // validating credential 
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password must not be empty').exists()
], async (req, res) => {
    let success = false;
    // checking validation errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // destructuring 'email' and 'password' from request body 
    const { email, password } = req.body;

    // checking if user exits or not 
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, 'error': 'Please enter the correct credentials' });
        }

        // comparing passwords and sending respons 
        const isCorrectPass = await bcrypt.compare(password, user.password);
        if (isCorrectPass) {
            success = true;
            const data = {
                user: {
                    id: user.id
                }
            };
            const jwtToken = jwt.sign(data, jwtSecret);
            res.status(200).json({ success, jwtToken });
        }
        else {
            res.status(400).json({ success, 'error': 'Please enter the correct credentials' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Route 3: Endpoint to upload profile pic 
Router.put('/uploadpic', fetchUser, [
    // validating url 
    body('pic', 'Please provide url of image').exists()
], async (req, res) => {
    let success = false;
    const user = req.user;

    // checking validation errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // destructuring 'pic' from request body 
    const { pic } = req.body;

    // checking if user exits or not 
    try {
        let newUser = await User.findByIdAndUpdate(user.id, {pic}, {new: true});
        success = true;
        return res.status(200).json({success, newUser});
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Route 4: Endpoint to Update user details
Router.put('/update', fetchUser, [
    // validating url 
    body('name', 'Name is not valid').isLength({ min: 3 }),
    body('profession', 'Profession not provided').exists()
], async (req, res) => {
    let success = false;
    const user = req.user;
    
    // checking validation errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // destructuring 'pic' from request body 
    const { name, profession } = req.body;

    // checking if user exits or not 
    try {
        let newUser = await User.findByIdAndUpdate(user.id, {name, profession}, {new: true});
        success = true;
        return res.status(200).json({success, newUser});
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured');
    }
})

// Route 5: Endpoint for fetching userData 
Router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (user) {
            res.status(200).json(user);
        }
        else
            console.log('user not found');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error occured')
    }
})

module.exports = Router;