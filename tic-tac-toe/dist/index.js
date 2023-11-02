import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import users from './routers/user.js';
import boards from './routers/board.js';
import moves from './routers/move.js';
import games from './routers/game.js';
import auth from './routers/auth.js';
import { app, server } from './socket.js';
mongoose.connect('mongodb+srv://milos:milos@cluster0.5ybabm5.mongodb.net/internshipLilly021')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...'));
const corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', users);
app.use('/api/boards', boards);
app.use('/api/moves', moves);
app.use('/api/games', games);
app.use('/api/auth', auth);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}...`));
//# sourceMappingURL=index.js.map