
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
    type: PieceType;
    color: PieceColor;
    emoji: string;
}

export interface Position {
    row: number;
    col: number;
}

export interface GameState {
    board: (ChessPiece | null)[][];
    currentTurn: PieceColor;
    isGameOver: boolean;
    winner: PieceColor | null;
}