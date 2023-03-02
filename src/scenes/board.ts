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
    static start = 1; // 'Start' of coordinates
    static size = 10; // Length of board in squares
    static squareSize = 34; // Length of square sprite in px
    static pieceSize = 32; // Length of piece sprite in px
    static offsetX = Board.size; // X-offset from corner of the canvas
    static offsetY = Board.size; // Y-offset from corner of the canvas
    
    turn: boolean = true; // true = white's turn, false = black's turn
    data: Square[] = Array(Board.size ** 2).fill(null);
    get(x: number, y: number) {
        return this.data[(y - 1) * Board.size + (x - 1)];
    }
    set(x: number, y: number, square: Square) {
        this.data[(y - 1) * Board.size + (x - 1)] = square;
        return square;
    }
};
class Square extends Phaser.GameObjects.Sprite {
    public posX: number;
    public posY: number;
    constructor(scene: Scene, x: number, y: number, type: SquareType) {
        let posX = Board.offsetX + x * Board.squareSize, posY = Board.offsetY + y * Board.squareSize;
        super(scene, posX, posY, 'square', type);
        this.posX = posX, this.posY = posY;
        scene.add.existing(this);
    }
    public piece: Piece = null;
    setPiece(piece: PieceType) {
        if (piece == null) return;
        this.piece = new Piece(this.scene, this.posX, this.posY, piece, this);
        this.scene.add.existing(this.piece);
    }
};
class Piece extends Phaser.GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number, piece: PieceType, square: Square) {
        super(scene, x, y, 'piece', piece);
    }
};
export class BoardScene extends Scene {
    pieceMap = new Map<number, PieceType[]>();
    board = new Board();
    constructor() {
        super('board-scene');
    }
    preload() {
        this.load.spritesheet('piece', './src/assets/pieces.png', {frameWidth: Board.pieceSize, frameHeight: Board.pieceSize});
        this.load.spritesheet('square', './src/assets/squares.png', {frameWidth: Board.squareSize, frameHeight: Board.squareSize});
    }
    create() {
        this.pieceMap.set(2, [PieceType.BA, null, PieceType.B2, PieceType.B3, PieceType.B4, PieceType.B5, PieceType.B6, PieceType.B7, null, PieceType.BS]);
        this.pieceMap.set(9, [PieceType.WA, null, PieceType.W2, PieceType.W3, PieceType.W4, PieceType.W5, PieceType.W6, PieceType.W7, null, PieceType.WS]);
        this.pieceMap.set(1, [PieceType.BM, PieceType.B8, PieceType.B7, PieceType.B6, PieceType.B5, PieceType.B4, PieceType.B3, PieceType.B2, PieceType.B8, PieceType.BD]);
        this.pieceMap.set(10, [PieceType.WM, PieceType.W8, PieceType.W7, PieceType.W6, PieceType.W5, PieceType.W4, PieceType.W3, PieceType.W2, PieceType.W8, PieceType.WD]);
        let square = SquareType.Square, piece: PieceType = null;
        for (let y = Board.start; y <= Board.size; y++) {
            for (let x = Board.start; x <= Board.size; x++) {
                if (y == Board.start + 2) piece = PieceType.B1;
                else if (y == Board.size - 2) piece = PieceType.W1;
                
                if ([...this.pieceMap.keys()].includes(y)) {
                    piece = this.pieceMap.get(y)[x - 1];
                }
                
                // Piece placement logic
                if (x == Board.start + 1 || x == Board.size - 1) {
                    if (y == Board.size - 1) square = SquareType.PromoteOpponent;
                    if (y == Board.start + 1) square = SquareType.PromotePlayer;
                }
                // Square placement logic
                this.board.set(x, y, new Square(this, x, y, square)).setPiece(piece);
                piece = null;
                square = SquareType.Square;
            }
        }
        // Create the board.
        
    }
};