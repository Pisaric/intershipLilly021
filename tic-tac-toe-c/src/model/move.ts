import { IGame } from "./game";


export interface IMove {
    _id: string;
    gameId: string | IGame;
    row: number;
    col: number;
}