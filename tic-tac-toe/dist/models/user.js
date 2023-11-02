import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        minlength: 5,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
    },
});
const UserModel = mongoose.model('Users', userSchema);
function generateAuthToken(user) {
    return jwt.sign({ _id: user._id, username: user.username }, "intershiplilly021_jwtPrivateKey");
}
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        surname: Joi.string().required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required().email(),
    });
    return schema.validate(user);
}
export { UserModel as User, validateUser, generateAuthToken };
//# sourceMappingURL=user.js.map