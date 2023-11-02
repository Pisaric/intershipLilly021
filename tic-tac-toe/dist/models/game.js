import mongoose, { Schema } from 'mongoose';
const gameSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Boards',
        required: true,
    },
    xPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        // required: true,
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
const GameModel = mongoose.model('Games', gameSchema);
export { GameModel };
//# sourceMappingURL=game.js.map