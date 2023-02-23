import {Scene} from 'phaser';

enum SquareType {
    PromotePlayer,
    PromoteOpponent,
    Square
};
enum PieceType {
    B1, B2, B3, B4, B5, B6, B7, B8,
    BA, BD, BM, BS,
    W1, W2, W3, W4, W5, W6, W7, W8,
    WA, WD, WM, WS
};
class Board {
    static size = 10; // Length of board in squares
    static squareSize = 34; // Length of square sprite in px
    static pieceSize = 32; // Length of piece sprite in px
    static offsetX = Board.size; // X-offset from corner of the canvas
    static offsetY = Board.size; // Y-offset from corner of the canvas

    data: Square[] = Array(Board.size ** 2).fill(null);
    get(x: number, y: number) {
        return this.data[y * Board.size + x];
    }
    set(x: number, y: number, square: Square) {
        this.data[y * Board.size + x] = square;
    }
};
class Square extends Phaser.GameObjects.Sprite {
    posX: number;
    posY: number;
    constructor(x: number, y: number, scene: Scene, type: SquareType) {
        let posX = Board.offsetX + x * Board.squareSize, posY = Board.offsetY + y * Board.squareSize;
        super(scene, posX, posY, 'square', type);
        this.posX = posX;
        this.posY = posY;
        scene.add.existing(this);
    }
    piece: Piece = null;
    setPiece(piece: PieceType) {
        this.piece = new Piece(this.scene, this.posX, this.posY, 'piece', piece);
        this.scene.add.existing(this.piece);
    }
};
class Piece extends Phaser.GameObjects.Sprite {
    pieceType: PieceType = null;
};
export class BoardScene extends Scene {
    private board = new Board();
    constructor() {
        super('board-scene');
    }
    preload() {
        this.load.spritesheet('piece', './src/assets/pieces.png', {frameWidth: Board.pieceSize, frameHeight: Board.pieceSize});
        this.load.spritesheet('square', './src/assets/squares.png', {frameWidth: Board.squareSize, frameHeight: Board.squareSize});
    }
    create() {
        let squareType = SquareType.Square;
        for (let y = 1; y <= Board.size; y++) {
            for (let x = 1; x <= Board.size; x++) {
                if (x == 2 || x == Board.size - 1) {
                    if (y == Board.size - 1) squareType = SquareType.PromoteOpponent;
                    else if (y == 2) squareType = SquareType.PromotePlayer;
                }
                this.board.set(x, y, new Square(x, y, this, squareType));
                squareType = SquareType.Square;
            }
        }
        // Create the board.
        this.board.get(4, 4).setPiece(PieceType.BS);
    }
}