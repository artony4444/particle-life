

class engine
{
    constructor(containerID)
    {
        this.display = new display(containerID, this)
        this.particles = [] // 2d array
        this.vars()
    }
    
    createParticles(n, color="black")
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
    
    next()
    {
        this.update()
        this.display.draw()
    }
    
    update()
    {
        this.applyPhysics()
    }
    
    vars()
    {
        let count = 100
        
        this.createGroups(6, count);
        
        this.rules = this.createRules()
        // this.rules = [[-0.931095622610767,0.542100569968107,0.07338530275774957],[0.375033374897789,-0.7353994615993167,0.8038157143032514],[0.20617994419253804,-0.9892264869536405,0.15636213378198827]]
        
        // console.log(JSON.stringify(this.rules))
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
    }
    
    rule(par, par2, g)
    {
        for(let p of par)
        {
            let frc = {x:0, y:0}
            
            for(let p2 of par2)
            {
                if(p.pos == p2.pos) continue;
                
                let a = p.pos
                let b = p2.pos
                
                let d = {x: a.x-b.x, y: a.y-b.y}
                let dist = Math.sqrt(d.x*d.x + d.y*d.y)
                
                let limit = p2.mass*170
                if(dist > 0 && dist < limit)
                {
                    let size = p.mass*10
                    
                    let attrLen = dist - size
                    let mid = 0.5;
                    let attrMid = attrLen*mid
                    
                    let attraction = 0 // 1-dist/limit
                    let repulstion = ((1-(dist/size)) * -1)
                    
                    if(dist+size <= attrMid)
                    {
                        attraction = dist/attrMid
                    }
                    else if(dist+size > attrMid)
                    {
                        attraction = 1-(dist+size-attrMid)/(limit-attrMid) // 1−((12−10)÷(20−10))
                    }
                    
                    let fr = g * p2.mass
                    
                    if(dist <= p.mass*10) {frc.x += fr * repulstion * (d.x/dist) / p.mass}
                    else {frc.x += fr * attraction * (d.x/dist) / p.mass}
                    if(dist <= p.mass*10) {frc.y += fr * repulstion * (d.y/dist) / p.mass}
                    else {frc.y += fr * attraction * (d.y/dist) / p.mass}
                    
                }
            }
            
            let velo = get.addPos(p.velo, frc)
            let mult = 0.5; velo.x *= mult; velo.y *= mult;
            let pos = get.addPos(p.pos, p.velo)
            
            if(pos.x < 0) { pos.x = 0; velo.x -= frc.x }
            if(pos.x > this.display.size.width) { pos.x = this.display.size.width; velo.x -= frc.x; }
            if(pos.y < 0) { pos.y = 0; velo.x -= frc.x}
            if(pos.y > this.display.size.height) { pos.y = this.display.size.height; velo.x -= frc.x; }
            
            p.velo = velo;
            p.pos = pos;
            
            if(p.pos.x <= 0 || p.pos.x >= this.display.size.width){p.velo.x *= -1}
            if(p.pos.y <= 0 || p.pos.y >= this.display.size.height){p.velo.y *= -1}
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




/*
        // atomic model --> [[-0.7007025392651327,0.47105731750112856,-0.2199809608751071],[-0.9741237491118016,-0.8959914615540066,0.40256374850646726],[0.016974505951858898,-0.11838072403060895,-0.8796658538495254]]
        
        // atomic battle --> [[1.2928484184302347,-0.9306707586663387,0.534831604554153],[-2.883564440055273,-3.5505454311317086,-2.865369144984893],[3.3636400366477766,-1.010109751475552,-1.1422993848397933]]
        
        // stable life --> [[0.6120252112539699,0.11576248578180648,0.7269839323506462,-0.17241496387978072,-0.11653762500440257,0.40903298242563935],[0.7379837289639739,0.7130202515162858,0.5469483762866854,-0.5783416845417815,-0.40888888358496,0.6183137162214716],[-0.5859487797624325,-0.07579647228898567,-0.9674073992347916,0.933550958612893,-0.12731442146026728,0.517152632561007],[0.7611516238361542,0.25421512483959985,-0.9931041588765233,0.29512429766003434,0.6760300283172116,0.5834461989611559],[0.7238106136343019,0.6813365828622331,0.4761213579998378,-0.6256763300102413,-0.03994705343541671,0.07005616835304052],[-0.7101076030528062,0.649332879990312,-0.36130269637656687,-0.5943818826106955,0.18187855689172983,0.4721288911620545]]
        
        // bugs --> [[-0.9244612645787442,0.5602116774591241,0.1656709566399206,0.35207128484469763,0.0016536042755319613,-0.388640549588374],[-0.4084490484065162,0.3431750965386935,0.3161767200902368,-0.06224525383352608,-0.3013065968461417,0.6837770853908389],[-0.038608083594506404,-0.3529562965453632,-0.6719629763329791,-0.6605045047039262,-0.34019509796796044,0.4996470817885963],[0.28558595390658104,-0.4312020952778517,-0.3741322193661256,0.5676540885865222,-0.47869900422942635,0.5757375393318331],[-0.1948843188348044,0.22075538615948842,0.40300519098810605,-0.4770137247206221,-0.15619215611866633,-0.2702287551005558],[0.5160910965918872,0.40121774025176427,-0.2191273992365681,-0.519284027509316,-0.16613287778550578,-0.9814025561009232]]
        
        // () spider --> [[-0.04519856378443743,0.046523651911980046,-0.48203283775974803,-0.17700679699386157,-0.12219825829124886,-0.47882214586613614],[-0.22072331484574548,-0.9801580575272513,0.5936960380475278,-0.9239349954002862,0.4256871829231712,-0.4701309240682954],[-0.5689173317383576,-0.23124192040415714,0.7790803228992966,0.9246746222695701,-0.7004217619695914,0.9358451737008235],[0.19631845568728012,-0.9388216945891465,0.2176487494139563,-0.2696757899090092,-0.4037812846356723,-0.741995051336283],[-0.2232687340676338,0.12860818403616658,0.11518561620248002,-0.1548031690500271,-0.19054591185229341,0.26897875393742465],[-0.08398063416220358,0.242848940398249,0.4626112742230126,0.3288380039893335,-0.0577541797172243,-0.5376100748430694]]
        
        // () splitcells --> [[-0.931095622610767,0.542100569968107,0.07338530275774957],[0.375033374897789,-0.7353994615993167,0.8038157143032514],[0.20617994419253804,-0.9892264869536405,0.15636213378198827]]
        
        let yellow = this.yellow;
        let red = this.red;
        let green = this.green;
        
        this.rule(yellow, red, -1)
        this.rule(red, yellow, -1)
        this.rule(yellow, yellow, 1)
        this.rule(red, red, 1)
        
        // velo 0.9
        this.rule(red, red, -0.1)
        this.rule(red, yellow, -0.02)
        this.rule(yellow, red, 0.02)
        //new addup
        this.rule(green, green, -0.07)
        this.rule(green, red, -0.02)
        this.rule(red, green, -0.01)
        
        // fly
        this.rule(green, green, -0.32)
        this.rule(green, red, -0.17)
        this.rule(green, yellow, 0.34)
        this.rule(red, red, -0.10)
        this.rule(red, green, -0.34)
        this.rule(yellow, yellow, 0.15)
        this.rule(yellow, green, -0.20)
        // worst
        this.rule(red, red, 0.1)
        this.rule(yellow, red, 0.15)
        this.rule(green, green, -0.7)
        this.rule(green, red, -0.2)
        this.rule(red, green, -0.1)
        
        
        
                // old force
                
                if(dist > 0 && dist < 100)
                {
                    let fr = (g * p2.mass / dist)
                    frc.x += (fr * d.x)
                    frc.y += (fr * d.y)
                    
                    if(dist <= p2.mass*10){frc.x *= -1}
                    if(dist <= p2.mass*10){frc.y *= -1}
                }
                
                
                // new force 
                
                let limit = 100
                
                if(dist > 0 && dist < limit)
                {
                    let attraction = 1-dist/limit
                    let repulstion = 1-dist/(p.mass*10) * -1
                    
                    let fr = g * p2.mass
                    
                    // frc.x += fr * attraction * (d.x/dist) / p.mass
                    // frc.y += fr * attraction * (d.y/dist) / p.mass
                    
                    if(dist <= p.mass*10) {frc.x += fr * repulstion * (d.x/dist) / p.mass}
                    else {frc.x += fr * attraction * (d.x/dist) / p.mass}
                    if(dist <= p.mass*10) {frc.y += fr * repulstion * (d.y/dist) / p.mass}
                    else {frc.y += fr * attraction * (d.y/dist) / p.mass}
                    
                }
                
                
                // new v2
                
                let limit = p2.mass*170
                if(dist > 0 && dist < limit)
                {
                    let size = p.mass*10
                    
                    let attrLen = dist - size
                    let mid = 0.5;
                    let attrMid = attrLen*mid
                    
                    let attraction = 0 // 1-dist/limit
                    let repulstion = ((1-(dist/size)) * -1) * 10
                    
                    if(dist+size <= attrMid)
                    {
                        attraction = dist/attrMid
                    }
                    else if(dist+size > attrMid)
                    {
                        attraction = 1-(dist+size-attrMid)/(limit-attrMid) // 1−((12−10)÷(20−10))
                    }
                    
                    let fr = g * p2.mass
                    
                    if(dist <= p.mass*10) {frc.x += fr * repulstion * (d.x/dist) / p.mass}
                    else {frc.x += fr * attraction * (d.x/dist) / p.mass}
                    if(dist <= p.mass*10) {frc.y += fr * repulstion * (d.y/dist) / p.mass}
                    else {frc.y += fr * attraction * (d.y/dist) / p.mass}
                    
                }
                
                
        
        this.yellow = this.createParticles(count, this.randomColor()) //"#c1be71")
        this.red = this.createParticles(count, this.randomColor()) //"#ce8856")
        this.green = this.createParticles(count, this.randomColor()) //"#7b9f5d")
        this.cyan = this.createParticles(count, this.randomColor()) //"#5d8cb9")
        this.white = this.createParticles(count, this.randomColor()) //"grey")
        this.brown = this.createParticles(count, this.randomColor()) //"brown")
        
*/
