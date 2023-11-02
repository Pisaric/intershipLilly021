import mongoose, { Document, Schema, Model } from 'mongoose';
import Joi from 'joi';

export interface IMove extends Document {
  gameId: Schema.Types.ObjectId;
  row: number;
  col: number;
}

const moveSchema = new Schema<IMove>({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Games',
    required: true,
  },
  row: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
  col: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
});

const MoveModel: Model<IMove> = mongoose.model<IMove>('Moves', moveSchema);

function validateMove(move: IMove) {
  const schema = Joi.object<IMove>({
    gameId: Joi.string().required(),
    row: Joi.number().min(0).max(2).required(),
    col: Joi.number().min(0).max(2).required(),
  });

  return schema.validate(move);
}

export { MoveModel as Move, validateMove };
