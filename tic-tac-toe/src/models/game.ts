import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import Joi from 'joi';
import { IBoard } from './board.js';

export interface IGame extends Document {
  board: Types.ObjectId | IBoard; 
  xPlayer: Types.ObjectId;
  oPlayer: Types.ObjectId | null;
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  result: Types.ObjectId | null;
  type: 'multiplayer' | 'singleplayer';
}

const gameSchema = new Schema<IGame>({
  board: {
    type: Schema.Types.ObjectId,  
    ref: 'Boards',
    required: true,
  },
  xPlayer: {
    type: Schema.Types.ObjectId,  
    ref: 'Users',
  },
  oPlayer: {
    type: Schema.Types.ObjectId, 
    ref: 'Users',
    default: null,
  },
  winner: {
    type: String,
    enum: [null, 'X', 'O'],
    default: null,
  },
  isDraw: {
    type: Boolean,
    default: false,
  },
  result: {
    type: Schema.Types.ObjectId, 
    ref: 'Result',
  },
  type: {
    type: String,
    enum: ['multiplayer', 'singleplayer'],
  },
});

const GameModel: Model<IGame> = mongoose.model<IGame>('Games', gameSchema);
export { GameModel };
