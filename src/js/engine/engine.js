

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
        // this.rules = [[0.2036769408457033,0.9898788393481217,-0.04979607740020464,0.8151489340329898,-0.22318364438075733,0.7067149442650034],[-0.8622773506370343,-0.16487011202600366,0.2763383016949219,-0.39724838304358867,-0.8814852523394121,-0.9663600267231907],[-0.4779788761343524,-0.9018475319620647,0.47748326079398495,-0.8262732851340386,-0.3981230499607742,-0.10930582023670832],[-0.03873341902046645,-0.31744876659151133,-0.718049995361183,0.16708848453789615,0.3428669841370544,0.886567154528282],[0.1608564388544096,-0.08440039970598123,-0.06847844403537318,0.8030419096042727,0.4609558982441575,-0.0338310837913256],[0.6944575535905297,0.835697719539517,0.33970441797530704,0.275073977852863,0.24622764418961385,-0.3302563642654057]]
        
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
        
        /**/ let mass = Math.random()*0.5+0.2 
        /**/ created.forEach(p => p.mass = mass)
        
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
