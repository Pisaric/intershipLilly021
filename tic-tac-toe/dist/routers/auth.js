import express from 'express';
import { User, generateAuthToken } from '../models/user.js';
import Joi from 'joi';
const router = express.Router();
router.get('/', async (req, res) => {
    const users = await User.find().sort('username');
    res.send(users);
});
router.post('/', async (req, res) => {
    const { error } = validateCredential(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
        return res.status(400).send('Invalid email or password.');
    }
    const token = generateAuthToken(user);
    res.header('access-control-expose-headers', 'x-auth-token').send(token);
});
function validateCredential(credential) {
    const schema = Joi.object({
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required().email(),
    });
    return schema.validate(credential);
}
export default router;
//# sourceMappingURL=auth.js.map