const config = require('config');
const mongoose = require('mongoose')
Joi.objectId = require('joi-objectid')(Joi)
const users = require('./routers/user')
const express = require('express')
const app = express();

if(!config.get('jwtPrivateKet'))
{
    console.error('FATAL ERORR: jwtPrivateKet is not defined.');
    process.exit(1); //0 oznacava dobro sve ostalo oznacava gresku
}

mongoose.connect('mongodb+srv://milos:milos@cluster0.5ybabm5.mongodb.net/intershipLilly021')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/users', users)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));