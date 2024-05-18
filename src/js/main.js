
let test = new engine("container")

let interval = setInterval(run, 1000/vars.fps);

function run()
{
    if(vars.clean) test.display.ui.clean();
    test.next();
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
    let rules = JSON.stringify(test.rules, null, 0)
    navigator.clipboard.writeText(rules)
    console.log(rules)
}

function reload()
{
    test = new engine("container")
    // location.reload();
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
