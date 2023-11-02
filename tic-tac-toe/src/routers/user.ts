import _ from 'lodash';
import express, { Request, Response } from 'express';
import { User, validateUser as validate } from '../models/user.js';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req: Request, res: Response) => {
    const user = await User.findById(req.body._id).select('-password');
    res.send(user);
});

router.post('/', async (req: Request, res: Response) => {
    const { error } = validate(req.body.data);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User already registered.');

    user = new User(
        _.pick(req.body.data, ['name', 'email', 'password', 'username', 'surname'])
    );

    await user.save();

    const token = jwt.sign({ _id: user._id }, 'intershiplilly021_jwtPrivateKey');
    res.header('x-auth-token', token).header("access-control-expose-headers", "x-auth-token").send(_.pick(user, ['_id', 'name', 'email']));
});

export default router;
