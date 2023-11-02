import mongoose, { Document, Schema, Model } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
  generateAuthToken: () => string;
}

const userSchema = new Schema<IUser>({
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

const UserModel: Model<IUser> = mongoose.model<IUser>('Users', userSchema);

function generateAuthToken(user: IUser): string {
  return jwt.sign({ _id: user._id, username: user.username }, "intershiplilly021_jwtPrivateKey");
}

function validateUser(user: IUser) {
  const schema = Joi.object<IUser>({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().min(5).required().email(),
  });

  return schema.validate(user);
}

export { UserModel as User, validateUser, generateAuthToken };
