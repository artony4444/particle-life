
class get
{
    static addPos(...pos)
    {
        let initial = {x:0, y:0};
        
        return pos.reduce((sumPos, pos) =>
            {
                let x = {
                    x: sumPos.x + pos.x,
                    y: sumPos.y + pos.y
                }; return x
            }, initial)
    }
}

class vars
{
    static clean = 1; // 0 false | 1 true
    static fps = 60;
    static displaySize = 1080;
    
    static radius = 170;
    static particleScale = 0.3;
    static particleForceMid = 0.5;
    static valocity = 0.5;
    static noWall = true; // fps drop (need to optimize)
    
    static centerParticles = true;
    static totalParticle = 400
    static particleColorCount = 6
    static particleCount = parseInt(this.totalParticle/this.particleColorCount)
}
