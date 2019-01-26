export default class Renderer {
    
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSquare(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }

}