
class particle
{
    constructor(screen, pos, mass=1, color="green")
    {
        this.screen = screen
        this.pos = pos
        this.velo = {x:(Math.random()-0.5), y:(Math.random()-0.5)}
        this.mass = mass // Math.random()*0.5+0.2 // Math.random()*0.3+0.2
        this.color = color
        
        this.snakeInit()
    }
    
    snakeInit() { this.snakeLength = 100; this.snake = [] }
    
    snakeMove() { if(this.snake.length >= this.snakeLength) this.snake.shift(); this.snake.push(this.pos); }
   
    drawSnake()
    {
        return;
        this.snakeMove();
        let c = this.color.split(",").map(s => parseInt(s.replace(/\D/g, '')) );
        for(let a = 0; a < this.snake.length-1; a++)
        {
            let opacity = (a / this.snake.length)*1;
            let color = "rgba("+c[0]+", "+c[1]+", "+c[2]+", "+opacity+")";
            this.screen.ui.drawLine(this.snake[a], this.snake[a+1], color, this.mass*this.screen.ui.uiScale/10)
        }
    }
    
    draw()
    {
        this.screen.ui.drawParticle(this);
    }
}
