

class ui
{
    constructor(engine, containerID, size)
    {
        this.engine = engine;
        this.container = document.getElementById(containerID);
        
        this.can = null;
        this.ctx = null;
        
        this.size = size;
        this.createCanvas();
        
        this.vars()
    }
    
    vars()
    {
        this.uiScale = 2;
    }
    
    createCanvas()
    {
        let width = this.size.width;
        let height = this.size.height;
        
        let can = document.createElement('canvas');
        
        can.id = this.id+":canvas";
        can.className = "canvas";
        can.width = width;
        can.height = height;
        //can.style.touchAction = "none";
        can.addEventListener("touchstart", e => click(e));
        can.addEventListener("touchmove", e => click(e));
        
        this.container.innerHTML = "";
        this.container.appendChild(can);
        
        this.can = can;
        this.ctx = can.getContext("2d");
    }
    
    StylePos2CanvasPos(pos)
    {
        return {
            x: pos.x * this.pixalStyleSize().x,
            y: pos.y * this.pixalStyleSize().y
        }
    }
    
    pixalStyleSize()
    {
        return {
            x: this.size.width / this.can.offsetWidth,
            y: this.size.height / this.can.offsetHeight
        }
    }
    
    drawCircle(pos, color, radius=10)
    {
        let x = pos.x;
        let y = pos.y;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0+x, 0+y);
        this.ctx.lineTo(0+x, 0+y);
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = radius;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
    
    drawLine(pos1, pos2, color, radius=10)
    {
        let x1 = pos1.x;
        let y1 = pos1.y;
        
        let x2 = pos2.x;
        let y2 = pos2.y;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0+x1, 0+y1);
        this.ctx.lineTo(0+x2, 0+y2);
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = radius;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
    
    drawParticle(p)
    {
        this.drawCircle(p.pos, p.color, p.mass*this.uiScale)
        // this.drawCircle(p.pos, "rgba(200,200,200,0.2)", p.mass*170)
    }
    
    clean()
    {
        this.ctx.beginPath();
        this.ctx.clearRect(0,0, this.can.width, this.can.height);
    }
}
