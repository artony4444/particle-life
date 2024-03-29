

class engine
{
    constructor(containerID)
    {
        this.display = new display(containerID, this)
        this.particles = [] // 2d array
        this.vars()
    }
    
    vars()
    {
        this.particleInit()
    }
    
    particleInit()
    {
        let num = vars.particleColorCount
        let len = vars.particleCount
        
        this.rules = {
            colorCount : num,
            colors: this.createColors(num),
            mass : this.createMasses(num),
            force : this.createForces(num)
        }
        
        // this.rules =  
        
        
        this.createGroups(this.rules.colorCount, len)
    }
    
    createGroups(num, size)
    {
        this.particles = []
        let created = []
        for(let a = 0; num > a; a++)
        {
            created.push(this.createParticles(size, this.randomColor() ))
        }
        
        this.applyMasses()
        this.applyColors()
        
        return created
    }
    
    createParticles(n, color="white")
    {
        let created = []
        for(let a = 0; n > a; a++)
        {
            created.push(
            new particle(this.display, this.display.randomPos(), color ))
        }
        this.particles.push(created)
        return created
    }
    
    createColors(len)
    {
        let colors = []
        for(let a = 0; a < len; a++)
        {
            colors.push(this.randomColor())
        }
        return colors
    }
    
    applyColors()
    {
        let colors = this.rules.colors
        this.particles.forEach((arr, i) => arr.forEach(p => {p.color = colors[i]} ))
    }
    
    createMasses(len)
    {
        let mass = []
        let minMass = 0.2
        let maxMass = 0.7
        let rMass = maxMass - minMass
        
        for(let a = 0; a < len; a++)
        {
            mass.push(Math.random()*rMass+minMass)
        }
        return mass
    }
    
    applyMasses()
    {
        let mass = this.rules.mass
        this.particles.forEach((arr, i) => arr.forEach(p => {p.mass = mass[i]} ))
    }
    
    createForces(size)
    {
        let forces = [];
        let force = 2 * 1
        
        for(let p = 0; p < size; p++)
        {
            forces[p] = [];
            
            for(let p2 = 0; p2 < size; p2++)
            {
                forces[p].push(Math.random()*force-force/2)
            }
        }
        return forces;
    }
    
    applyForces()
    {
        let part = this.particles
        let force = this.rules.force
        
        for(let p in part)
        {
            for(let p2 in part)
            {
                this.rule(part[p], part[p2], force[p][p2])
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
                    if(a.x > width - limit && b.x < limit) { b.x += width }
                    else if(a.x < limit && b.x > width - limit) { b.x -= width }
                    if(a.y > height - limit && b.y < limit) { b.y += height }
                    else if(a.y < limit && b.y > height - limit) { b.y -= height }
                }
                
                let d = {x: (b.x-a.x), y: (b.y-a.y)}
                let dist = Math.sqrt(d.x**2 + d.y**2)
                
                if(dist >= 0 && dist <= limit)
                {
                    let fr = g * p2.mass
                    
                    let size = limit*vars.particleScale // (p2.mass + p.mass)*10/2
                    
                    let attrLen = limit - size
                    let mid = vars.particleForceMid
                    let attrMid = attrLen*mid
                    let attrPos = dist - size
                    
                    let attraction = 0
                    let repulstion = 1-(dist/size)
                    
                    if(attrPos <= attrMid)
                    {
                        attraction = attrPos/attrMid
                    }
                    else if(attrPos > attrMid)
                    {
                        attraction = 1-(attrPos-attrMid)/(limit-attrMid) // 1−((12−10)÷(20−10))
                    }
                    if(attraction == "-Infinity") attraction = 0;
                    if(fr > 0) repulstion *= -1
                    
                    attraction *= 1
                    repulstion *= 1
                    
                    if(dist <= size) {frc.x += fr * repulstion * (d.x/dist) / p.mass}
                    else             {frc.x += fr * attraction * (d.x/dist) / p.mass}
                    if(dist <= size) {frc.y += fr * repulstion * (d.y/dist) / p.mass}
                    else             {frc.y += fr * attraction * (d.y/dist) / p.mass}
                    
                }
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
                if(p.pos.x <= 0 || p.pos.x >= width){p.velo.x *= -1}
                if(p.pos.y <= 0 || p.pos.y >= height){p.velo.y *= -1}
            }
        }
    }
    
    randomColor()
    {
        let r = random()
        let g = random()
        let b = random()
        
        return "rgb("+r+", "+g+", "+b+")"
        
        function random()
        {
            let brightness = 100;
            return parseInt(Math.random()*(255-brightness)+brightness);
        }
    }
}
