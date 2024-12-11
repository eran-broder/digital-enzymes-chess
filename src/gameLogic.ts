
import { Piece, PieceType, Color, Position, Move, GameState } from './types/chess';

// Emoji pieces
const WHITE_PIECES = {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
};

const BLACK_PIECES = {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
};

export class ChessGame {
    private board: (Piece | null)[][];
    private currentTurn: Color;
    private gameOver: boolean;

    constructor() {
        this.board = this.initializeBoard();
        this.currentTurn = 'white';
        this.gameOver = false;
    }

    private initializeBoard(): (Piece | null)[][] {
        // Create 8x8 board
        const board: (Piece | null)[][] = Array(8).fill(null)
            .map(() => Array(8).fill(null));

        // Set up black pieces
        board[0] = this.createBackRank('black');
        board[1] = this.createPawnRank('black');

        // Set up white pieces
        board[7] = this.createBackRank('white');
        board[6] = this.createPawnRank('white');

        return board;
    }

    private createBackRank(color: Color): Piece[] {
        const pieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        return pieces.map(type => ({
            type,
            color,
            symbol: color === 'white' ? WHITE_PIECES[type] : BLACK_PIECES[type]
        }));
    }

    private createPawnRank(color: Color): Piece[] {
        return Array(8).fill(null).map(() => ({
            type: 'pawn',
            color,
            symbol: color === 'white' ? WHITE_PIECES.pawn : BLACK_PIECES.pawn
        }));
    }

    public getBoard(): (Piece | null)[][] {
        return this.board.map(row => [...row]);
    }

    public getCurrentTurn(): Color {
        return this.currentTurn;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public makeMove(from: Position, to: Position): boolean {
        const piece = this.board[from.row][from.col];
        
        // Basic validation
        if (!piece) return false;
        if (piece.color !== this.currentTurn) return false;
        if (!this.isValidMove(from, to)) return false;

        // Check if capturing a king
        const targetPiece = this.board[to.row][to.col];
        if (targetPiece?.type === 'king') {
            this.gameOver = true;
        }

        // Make the move
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;

        // Switch turns
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

        return true;
    }

    private isValidMove(from: Position, to: Position): boolean {
        // Basic move validation
        if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;

        const targetPiece = this.board[to.row][to.col];
        if (targetPiece && targetPiece.color === this.currentTurn) return false;

        return true; // Simplified validation - allows any move to empty or enemy square
    }

    public getGameState(): GameState {
        return {
            board: this.getBoard(),
            currentTurn: this.currentTurn,
            gameOver: this.gameOver
        };
    }
}