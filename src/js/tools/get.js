
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
    static fps = 60; // 10slow 1000fast
    
    static radius = 400;
    static particleScale = 0.3;
    static particleForceMid = 0.5;
    static valocity = 0.5;
    static noWall = true;
    
    static centerParticles = true;
    static particleCount = 100
    static particleColorCount = 4
}
