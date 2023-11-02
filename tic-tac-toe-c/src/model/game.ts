import { IBoard } from "./board";
import { IUser } from "./user";

enum GameType {
    Multiplayer, Singleplayer
}

export interface IGame {
    _id: string;
    board: string | IBoard;
    xPlayer: string | IUser;
    oPlayer: string | IUser;
    winner: 'X' | 'O' | null;
    isDraw: boolean;
    result: string;
    type: GameType;
}