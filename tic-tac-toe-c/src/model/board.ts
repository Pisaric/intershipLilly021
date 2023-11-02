

export interface IBoard {
    _id: string;
    board: ('X' | 'O' | null)[][];
    currentPlayer: 'X' | 'O';
    winner: 'X' | 'O' | null;
    isDraw: boolean;
    isDeleted: boolean;
}