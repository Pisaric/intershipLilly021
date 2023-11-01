import express from 'express';
import { BoardModel as Board, validateBoard } from '../models/board.js';
import _ from 'lodash';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const board = await Board.findById(req.body._id);
        res.send(board);
    }
    catch (error) {
        res.status(404).send('Board not found');
    }
});
router.post('/', async (req, res) => {
    const { error } = validateBoard(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const board = new Board(_.pick(req.body, ['currentPlayer']));
    try {
        await board.save();
        res.send(_.pick(board, ['_id', 'board', 'currentPlayer', 'winner', 'isDraw']));
    }
    catch (error) {
        res.status(500).send('An error occurred while creating the board');
    }
});
router.put('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).send('The board with the given ID was not found');
        }
        board.set(req.body);
        const updatedGame = await board.save();
        res.send(_.pick(board, ['_id', 'board', 'currentPlayer', 'winner', 'isDraw']));
    }
    catch (error) {
        res.status(500).send('An error occurred while updating the board');
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board)
            return res.status(404).send('The board with the given ID was not found');
        // Delete
        board.isDeleted = true;
        const updatedGame = await board.save();
        // Return the same board
        res.send(updatedGame);
    }
    catch (error) {
        res.status(500).send('An error occurred while deleting the board');
    }
});
export default router;
//# sourceMappingURL=board.js.map