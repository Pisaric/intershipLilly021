import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
const moveSchema = new Schema({
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
const MoveModel = mongoose.model('Moves', moveSchema);
function validateMove(move) {
    const schema = Joi.object({
        gameId: Joi.string().required(),
        row: Joi.number().min(0).max(2).required(),
        col: Joi.number().min(0).max(2).required(),
    });
    return schema.validate(move);
}
export { MoveModel as Move, validateMove };
//# sourceMappingURL=move.js.map