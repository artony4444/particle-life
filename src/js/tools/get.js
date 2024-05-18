
class get
{
    static addPos(...pos)
    {
        return pos.reduce((sumPos, pos) =>
            {
                let x = {
                    x: sumPos.x + pos.x,
                    y: sumPos.y + pos.y
                }; return x
            }, {x:0, y:0} )
    }
    
    static randomColor()
    {
        let brightness = 100;
        let r = random(); let g = random(); let b = random()
        return "rgb("+r+", "+g+", "+b+")"
        function random(min=brightness, max=255) { return parseInt(Math.random()*(max-min)+min); }
    }
}

class vars
{
    static clean = 1; // 0 false | 1 true
    static fps = 60;
    static displaySize = 1600;
    
    static radius = 100;
    static valocity = 0.9;
    static noWall = true; // fps drop (need to optimize)
    
    static centerParticles = true;
    static totalParticle = 1000
    static particleColorCount = 6 // this.totalParticle
    static particleCount = parseInt(this.totalParticle/this.particleColorCount)
}
