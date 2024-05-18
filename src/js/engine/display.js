

class display
{
    constructor(containerID, engine)
    {
        this.size = { width:vars.displaySize, height:vars.displaySize }
        this.ui = new ui(this, containerID, this.size)
        this.engine = engine
    }
    
    draw()
    {
        /* particle */ this.engine.particles.forEach(arr => arr.forEach(p => p.drawSnake()))
        this.engine.particles.forEach(arr => arr.forEach(p => p.draw()))
    }
    
    isOutOfScreen(pos)
    {
        if(pos == null) return true
        if(pos.x >= 0 && pos.x < this.size.width && pos.y >= 0 && pos.y < this.size.height) return false; else return true
    }
    
    randomPos(s=this.size.width/10)
    {
        if(vars.centerParticles) return this.randomMidPos(s)
        return { 
        x: Math.random() * this.size.width, 
        y: Math.random() * this.size.height }
    }
    
    randomMidPos(s)
    {
        let mid = {x: this.size.width/2, y: this.size.height/2}
        let size = s;
        return {
            x: mid.x + (Math.random()*size) - (size/2),
            y: mid.y + (Math.random()*size) - (size/2) }
    }
}
