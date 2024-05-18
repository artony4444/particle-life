

class engine
{
    constructor(containerID)
    {
        this.display = new display(containerID, this)
        this.vars()
    }
    
    vars()
    {
        this.particleInit()
    }
    
    particleInit()
    {
        this.particles = [] // 2d array
        
        let num = vars.particleColorCount
        let len = vars.particleCount
        let dim = [num, len];
        
        this.rules = {
            colors :  this.randomColor(dim),
            mass   :  this.randomMass(dim), // .map((arr, i) => i==0 ? [20] : arr),
            force  :  this.randomForce([num, num]), // .map((arr,i) => i==0 ? arr.fill(0) : arr)
        }
        
        // this.rules = 
        
        this.createGroups(dim)
    }
    
    randomColor(dim)      { return this.createArray(dim[0], get.randomColor) }
    randomMass(dim)       { let scale = 0.5; let min =  3*scale; let max = 7*scale; return this.createArray(dim[0], Math.random).map(n => n * (max-min) + min) }
    randomForce(dim)      { let scale = 1; let min = scale * -1; let max = scale; return this.create2dArray(dim, Math.random).map(arr => arr.map(n => n * (max-min) + min)) }
    
    createGroups(dim)
    {
        this.particles = new Array(dim[0]).fill(0).map(e => new Array(dim[1]).fill(0).map(e2 =>
                new particle(this.display, this.display.randomPos())
            ))
        
        this.applyChanges("mass", this.rules.mass, true)
        this.applyChanges("color", this.rules.colors, true)
    }
    
    createArray(lem, func) { return new Array(lem).fill(0).map(e => func() ) }
    
    create2dArray(dim, func)
    {
        return new Array(dim[0]).fill(0).map(e => 
            new Array(dim[1]).fill(0).map(e2 => 
                func()
            )
        )
    }
    
    applyChanges(element, val, groupChanges=false)
    {
        if(groupChanges) this.particles.forEach((arr, i) => arr.forEach((p, i2) => {p[element] = val[i]} ))
        else this.particles.forEach((arr, i) => arr.forEach((p, i2) => {p[element] = val[i][i2]} ))
    }
    
    
    applyForces()
    {
        let part = this.particles
        let force = this.rules.force
        
        for(let p in part)
        {
            for(let p2 in part)
            {
                this.rule(part[p], part[p2], force[p][p2]/**/)
            }
        }
    }
        
    next() // call from main.js
    {
        this.update()
        this.display.draw()
    }
    
    update()
    {
        this.applyForces()
    }
    
    rule(par, par2, g)
    {
        // g = 0.5; // Math.random()*6.674;
        let noWall = vars.noWall
        
        let width = this.display.size.width
        let height = this.display.size.height
        
        for(let p of par)
        {
            let frc = {x:0, y:0}
            
            let a = {x: p.pos.x, y: p.pos.y}
            
            for(let p2 of par2)
            {
                if(p == p2) continue;
                
                let b = {x: p2.pos.x, y: p2.pos.y}
                
                let limit = p2.mass * vars.radius // 200
                
                if(noWall)
                {
                    limit = 500
                    if(a.x > width - limit && b.x < limit) { b.x += width }
                    else if(a.x < limit && b.x > width - limit) { b.x -= width }
                    if(a.y > height - limit && b.y < limit) { b.y += height }
                    else if(a.y < limit && b.y > height - limit) { b.y -= height }
                }
                
                let d = {x: (b.x-a.x), y: (b.y-a.y)}
                let dist = Math.sqrt(d.x**2 + d.y**2)
                
                // GRAVITY CODE 
                
                // if(dist < p2.mass*10) continue; // (1 / .5 = 2)
                
                if(dist < limit)
                {
                    let fr = (g * p2.mass * p.mass) / dist**2
                    
                    /* collision */ let scale = this.display.ui.uiScale*4; let collisionD = p2.mass*scale+p.mass*scale;
                    if(dist <= collisionD)
                    {
                        fr *= fr < 0 ? 1 : -1;
                    }
                    // fr = fr * (dist/limit)
                    
                    frc.x += (fr * d.x) / p.mass
                    frc.y += (fr * d.y) / p.mass
                    
                }
                
                // END OF GRAVITY CODE
            }
            
            let velo = get.addPos(p.velo, frc)
            let mult = vars.valocity; velo.x *= mult; velo.y *= mult;
            let pos = get.addPos(p.pos, p.velo)
            
            if(noWall)
            {
                if(pos.x < 0) { pos.x += width }
                if(pos.x > width) { pos.x -= width }
                if(pos.y < 0) { pos.y += height }
                if(pos.y > height) { pos.y -= height }
            }
            else
            {
                if(pos.x < 0) { pos.x = 0; velo.x -= frc.x }
                if(pos.x > width) { pos.x = width; velo.x -= frc.x; }
                if(pos.y < 0) { pos.y = 0; velo.y -= frc.y}
                if(pos.y > height) { pos.y = height; velo.y -= frc.y; }
            }
            
            p.velo = velo;
            p.pos = pos;
            
            if(!(noWall)) // wall repultion
            {
                if(p.pos.x <= 0 || p.pos.x >= width){p.velo.x *= -0.5}
                if(p.pos.y <= 0 || p.pos.y >= height){p.velo.y *= -0.5}
            }
        }
    }
}
