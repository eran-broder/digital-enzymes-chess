
import ChessGame from './gameLogic';
import { Position } from './types/chess';

class ChessUI {
    private game: ChessGame;
    private selectedPosition: Position | null = null;
    private boardElement: HTMLElement;
    private statusElement: HTMLElement;

    constructor() {
        this.game = new ChessGame();
        this.boardElement = document.getElementById('chess-board')!;
        this.statusElement = document.getElementById('game-status')!;
        this.initializeBoard();
        this.updateStatus();
    }

    private initializeBoard(): void {
        this.boardElement.innerHTML = '';
        const state = this.game.getState();

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell ' + ((row + col) % 2 === 0 ? 'white' : 'black');
                
                const piece = state.board[row][col];
                if (piece) {
                    cell.textContent = piece.emoji;
                }

                cell.addEventListener('click', () => this.handleCellClick(row, col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    private handleCellClick(row: number, col: number): void {
        const state = this.game.getState();
        
        if (this.selectedPosition === null) {
            // First click - select piece if it belongs to current player
            const piece = state.board[row][col];
            if (piece && piece.color === state.currentTurn) {
                this.selectedPosition = { row, col };
                this.highlightCell(row, col);
            }
        } else {
            // Second click - attempt to move piece
            const moveSuccess = this.game.movePiece(
                this.selectedPosition,
                { row, col }
            );

            // Remove previous highlight
            this.removeHighlight(this.selectedPosition.row, this.selectedPosition.col);
            this.selectedPosition = null;

            if (moveSuccess) {
                this.updateBoard();
                this.updateStatus();
            }
        }
    }

    private highlightCell(row: number, col: number): void {
        const index = row * 8 + col;
        const cell = this.boardElement.children[index] as HTMLElement;
        cell.classList.add('selected');
    }

    private removeHighlight(row: number, col: number): void {
        const index = row * 8 + col;
        const cell = this.boardElement.children[index] as HTMLElement;
        cell.classList.remove('selected');
    }

    private updateBoard(): void {
        const state = this.game.getState();
        const cells = this.boardElement.children;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = state.board[row][col];
                const cell = cells[row * 8 + col] as HTMLElement;
                cell.textContent = piece ? piece.emoji : '';
            }
        }
    }

    private updateStatus(): void {
        const state = this.game.getState();
        if (state.isGameOver) {
            this.statusElement.textContent = `Game Over! ${state.winner} wins!`;
        } else {
            this.statusElement.textContent = `Current turn: ${state.currentTurn}`;
        }
    }
}

// Initialize the UI when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new ChessUI();
});
