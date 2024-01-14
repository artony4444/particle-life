

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
    let rules = JSON.stringify(test.rules)
    navigator.clipboard.writeText(rules)
    console.log(rules)
}

function reload()
{
    // test = new engine("container")
    location.reload();
    chunks = [];
}


//https://medium.com/@amatewasu/how-to-record-a-canvas-element-d4d0826d3591

let canvas = test.display.ui.can

var videoStream = canvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);

var chunks = [];
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};

mediaRecorder.onstop = function(e) {
  var blob = new Blob(chunks, { 'type' : 'video/mp4' });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  
  
  const a = document.createElement('a');
  a.style = "display: none;";
  a.href = videoURL;
  a.download = "video.mp4";
  canvas.appendChild(a);
  // Trigger the file download
  a.click();
};
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};


function startStopRec()
{
    let rec = document.getElementById("recordButton")
    
    if(mediaRecorder.state == "inactive")
    {
        mediaRecorder.start();
        rec.innerHTML = "■ Stop";
        rec.style.backgroundColor = "#ea584e";
        
        // log("started")
    }
    else
    {
        mediaRecorder.stop();
        rec.innerHTML = "● Record";
        rec.style.backgroundColor = "#ffffff31";
        
        // log("stoped")
    }
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
