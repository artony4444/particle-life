

let test = new engine("container")

let interval = setInterval(run, 1000/vars.fps);

function run()
{
    if(vars.clean) test.display.ui.clean();
    test.next();
}

function stop()
{
    clearInterval(interval);
    window.close();
}

function start()
{
    test.start = true;
}

function log(str)
{
    console.log(str);
}



function click(event) 
{
    /*
    let can = test.display.ui.can
    
    let osx = can.offsetLeft;
    let osy = can.offsetTop;
    
    let x = event.targetTouches[0].clientX - osx // - can.width/2;
    let y = event.targetTouches[0].clientY - osy // - can.height/2;
    
    let pos = test.display.ui.StylePos2PixalPos({x:x,y:y})
    
    test.addBlock(pos)
    */
}

function getRules()
{
    let rules = JSON.stringify(test.rules)
    navigator.clipboard.writeText(rules)
    console.log(rules)
}

function reload()
{
    test = new engine("container")
}





/*

    engine: 
    {
        display:
        {
            screen: [pixal]
            ui: {}
        }
    }
    
*/









/*
let x = pos.x;
        let y = pos.y;
        
        ctx.beginPath();
        ctx.moveTo(0+x, 0+x);
        ctx.lineTo(0+x, 0+x);
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        
fillRect(x, y, width, height): Draws a filled rectangle.

strokeRect(x, y, width, height): Draws a rectangular outline.

clearRect(x, y, width, height): Clears the specified rectangular area, making it fully transparent.

*/
