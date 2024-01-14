

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
    
    next()
    {
        this.update()
        this.display.draw()
    }
    
    update()
    {
        this.applyPhysics()
    }
    
    particleInit()
    {
        let count = vars.particleCount
        this.createGroups(vars.particleColorCount, count);
        this.rules = this.createRules()
        // this.rules = [[0.3424917974074637,-0.34930799596464784,0.3548724819672413,0.3976379866825952,0.2820004018327019,0.3819007211052363],[0.03602084124323257,-0.237672647227762,0.3194886888633932,-0.6391383103768179,0.16772332928817824,0.4586195212202877],[0.4028250606822654,0.2805991560798431,0.47372507371872863,0.46692368582500565,0.2538742481744757,0.19995782648171756],[-0.6545660478169739,-0.45227578775872,0.5748178620671103,-0.08169267274234482,-0.13543417506799404,-0.5023547561228248],[-0.42722916260340354,0.6203391135348757,-0.15440846764252503,-0.44088413262749804,0.019573680542387395,0.6196616068580738],[-0.36488119160569643,-0.04669796753883293,-0.4871183877795052,-0.01635982466936714,-0.5507396991835529,-0.26898827290236]]
        
    }
    
    createGroups(num, size)
    {
        let created = []
        for(let a = 0; num > a; a++)
        {
            created.push(this.createParticles(size, this.randomColor()))
        }
        return created
    }
    
    createParticles(n, color="black")
    {
        let created = []
        for(let a = 0; n > a; a++)
        {
            created.push(
            new particle(this.display, this.display.randomPos(), color ))
        }
        // let mass = Math.random()*0.5+0.2
        // created.forEach(p => p.mass = mass)
        this.particles.push(created)
        return created
    }
    
    createRules()
    {
        let part = this.particles
        let rules = [];
        this.force = 2*1
        let force = this.force
        
        for(let p in part)
        {
            rules[p] = [];
            
            for(let p2 in part)
            {
                rules[p].push(Math.random()*force-force/2)
            }
        }
        return rules;
    }
    
    applyRules()
    {
        let part = this.particles
        let rls = this.rules
        
        for(let p in part)
        {
            for(let p2 in part)
            {
                this.rule(part[p], part[p2], rls[p][p2])
            }
        }
    }
    
    applyPhysics()
    {
        this.applyRules()
        // this.rule(this.particles[0], this.particles[0], -1)
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
        let r = Math.random()*200 + 50
        let g = Math.random()*200 + 50
        let b = Math.random()*200 + 50
        
        return "rgb("+r+", "+g+", "+b+")"
    }
}
