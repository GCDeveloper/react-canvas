let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let dots = [];
let w = 0;
let h = 0;
let mouseRadius = 50;
let dotRadius = 2.5;
let dotsToSpawn = 100;
function resize(){
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}
function init(){
  for(let i=0;i<dotsToSpawn;i++){
    dots.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: dotRadius
    });
  }
}
function update(mx, my){
 dots = dots.map(({x,y,r}) => {
   //move x,y of dot away from mouse
   let dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
   let angle = Math.atan2(my-y, mx-x);
   while(dist < mouseRadius){
     x -= Math.cos(angle);
     y -= Math.sin(angle);
     dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
   }
   return {x,y,r}
 });
}
function draw(){
 ctx.clearRect(0,0,w,h);
 ctx.beginPath();
 dots.forEach(({x,y,r}) => {
   ctx.moveTo(x+r, y);
   ctx.arc(x, y, r, 0, Math.PI*2);
 });
 ctx.closePath();
 ctx.fillStyle = 'black';
 ctx.fill();
}
function loop(){
 draw();
 requestAnimationFrame(loop);
}
window.addEventListener("resize", resize);
document.addEventListener("mousemove", (e)=>{
  update(e.pageX, e.pageY);
});
resize();
init();
loop();
<canvas id="canvas"/>
