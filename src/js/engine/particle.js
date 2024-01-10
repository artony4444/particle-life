
class particle
{
    constructor(screen, pos, color="black")
    {
        this.screen = screen
        this.pos = pos
        this.velo = {x:0, y:0}
        this.mass = Math.random()*0.5+0.2 // Math.random()*0.3+0.2
        this.color = color
    }
    
    addVelocity()
    {
        this.pos.x += this.velo.x
        this.pos.y += this.velo.y
        // this.velo = {x:0, y:0}
    }
    
    draw()
    {
        this.screen.ui.drawParticle(this);
    }
}
