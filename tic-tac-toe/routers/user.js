const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

//fali auth
router.get('/', auth ,async (req, res) => {
    const user = await User.findById(req.body._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body.data);
    if(error) return res.status(400).send(error.details[0].message);
  
    let user = User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('User already registred.');

    user = User.findOne({ username: req.body.username });
    if(!user) return res.status(400).send('User already registred.');

    user = new User(
        _.pick(req.body.data, ['name', 'email', 'password', 'username', 'surname'])
    )

  //  const salt = await bcrypt.genSalt(10);
  //  const hashed = await bcrypt.hash(user.password, salt);

    let = await user.save();

    const token = jwt.sign({ _id: user._id}, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).header("access-control-expose-headers", "x-auth-token").send( _.pick(user, ['_id','name', 'email']));
});

router.put('/:id', (req, res) => {
    //trazi entitet
    // ako gga nema PV 404(Object not found)
    const course = courses.find(c => c.id === parseInt(req.params.id));
  
    if(!course)
    {
        return res.status(404).send('The course with the given ID was not found');
    }
        
    //Validate
    //ako je invalid return 400 - Bad request
   
    const { error } = validateCourse(error.details[0].message); //od cele PV se samo uzima property error
    if(error)
    {
        res.status(400).send(result.error.details[0].message);
    }

    //Update
    //Return the updated entity
    course.name = req.body.name;
    res.send(course);
})




router.delete('/:id', (req, res) => {
    //look up entity
    // Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
  
    if(!course) res.status(404).send('The course with the given ID was not found');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course)
})

module.exports = router;

