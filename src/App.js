import React, { Component } from 'react';
import './App.css';
let dots = [];
let mouseRadius = 250;
let dotRepelRadius = 50;
let dotRadius = 2.5;
let dotsToSpawn = 100;
let mx = 0;
let my = 0;
let ox = 0;
let oy = 0;
let frame = 0;
class App extends Component {
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
  }
  init(){
    const w = this.w;
    const h = this.h;
    let dotsToSpawn = Math.floor(((w+h)/2)/10);
    for(let i=0;i < dotsToSpawn;i++){
      dots.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx:Math.random()*2-1,
        vy:Math.random()*2-1,
        r: Math.random()*4+1
      });
    }
  }
  update(mx, my){
    const w = this.w;
    const h = this.h;
    let xCount = 0;
    let yCount = 0;
    //const wh = w*h;
    console.log(frame);
    dots = dots.map(({x,y,vx,vy,r}, i) => {

      //let distFromCenter = Math.sqrt(((w/2-x)**2)+((h/2-y)**2));
      //move x,y of dot away from mouse
      //let dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
      //let angle = Math.atan2(my-y, mx-x);
      //if(dist < mouseRadius){
      // x += Math.cos(angle)*(mouseRadius/dist);
      // y += Math.sin(angle)*(mouseRadius/dist);
       //dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
      //}
      dots.forEach((d, j) => {
        if(i !== j){
          let dist = Math.sqrt(((d.x-x)**2)+((d.y-y)**2));
          let angle = Math.atan2(d.y-y, d.x-x);
          let xWarp = (r*d.r);
          let yWarp = (r*d.r);
          if(frame < 385+(i+j)){
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
            }
          } else if(frame < 450+(i)){
            mouseRadius += Math.abs(Math.sin(frame/(xWarp**2)));
            //angle += Math.PI*(distFromCenter/wh);
            angle += Math.PI*((frame-385)*0.01);
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/xWarp));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/yWarp));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/xWarp));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/yWarp));
            }
          } else if(frame < 1150+(i)){
            mouseRadius = 250;
            angle += Math.PI*((frame-675)*0.02);
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
            }
          } else if(frame < 1865+(i)){
            xWarp = 80;
            yWarp = 80;
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/xWarp));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/yWarp));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/xWarp));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/yWarp));
            }
          } else if(frame < 4200+(i)){
            if(frame === 1865+(i)){
              vx = Math.cos(angle-Math.PI/2)*Math.random()*2;
              vy = Math.sin(angle-Math.PI/2)*Math.random()*2;
            }
            //if(dist < mouseRadius*0.25){
            //  vx -= Math.cos(angle)*(dotRepelRadius/dist);
            //  vy -= Math.sin(angle)*(dotRepelRadius/dist);
            //} else {
              vx += (Math.cos(angle)*(dotRepelRadius/dist**(1.8)))*0.01;
              vy += (Math.sin(angle)*(dotRepelRadius/dist**(1.8)))*0.01;
              if(dist < r+d.r){
                vx -= (Math.cos(angle)*(dotRepelRadius/dist**(1.8)))*0.1;
                vy -= (Math.sin(angle)*(dotRepelRadius/dist**(1.8)))*0.1;
                x -= Math.cos(angle)*(Math.abs(vx+vy)/2);
                y -= Math.sin(angle)*(Math.abs(vx+vy)/2);
                //vx *= 0.7;
                //vy *= 0.7;
                //d.vx = (d.vx+vx)/2;
              //  vx = d.vx;
              //  d.vy = (d.vy+vy)/2;
              //  vy = d.vy;
              //  vx -= (Math.cos(angle)*(dotRepelRadius/dist))/10;
              //  vy -= (Math.sin(angle)*(dotRepelRadius/dist))/10;
              //  vx *= 0.9;
              //  vy *= 0.9;
              }
              if(Math.abs(vx)+Math.abs(vy) > 11){
                vx *= 0.5;
                vy *= 0.5;
              }
           //}

         } else {
           vx = 0;
           vy = 0;
           //frame = 0;
           //console.log("frame just set to 0", frame);
           if(dist < mouseRadius){
             x -= Math.cos(angle)*(dotRepelRadius/dist);
             y -= Math.sin(angle)*(dotRepelRadius/dist);
           } else {
             x += Math.cos(angle)*(dotRepelRadius/dist)*4;
             y += Math.sin(angle)*(dotRepelRadius/dist)*4;
           }
           if(frame >= 4600+(i)){
             frame = 0;
           }
           //vx = 0;
           //vy = 0;
         }
        }
      });
      if(frame >= 1865){
        x += vx;
        y += vy;
      }
      //vx *= 0.99;
      //vy *= 0.99;
      xCount += x;
      yCount += y;
      return {x,y,vx,vy,r}
    });
    ox = xCount/dots.length-w/2;
    oy = yCount/dots.length-h/2;
  }
  draw(){
    const w = this.w;
    const h = this.h;
    const ctx = this.ctx;
    ctx.fillStyle='rgba(0,0,0,0.05)';
    ctx.fillRect(0,0,w,h);
    ctx.beginPath();
    dots.forEach(({x,y,r}) => {
      ctx.moveTo(x+r-ox, y-oy);
      ctx.arc(x-ox, y-oy, r, 0, Math.PI*2);
    });
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  loop(){
    frame ++;
    this.update(mx, my);
    this.draw();
    requestAnimationFrame(()=>{
     this.loop();
    });
  }
  componentDidMount(){
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    document.addEventListener("mousemove", (e)=>{
      mx = e.pageX;
      my = e.pageY;
    });
    this.ctx = this.canvasElement.getContext('2d');
    this.init();
    this.loop();
  }
  render() {
    return (
      <div className="App">
        <canvas ref={(el)=>this.canvasElement = el}></canvas>
      </div>
    );
  }
}

export default App;
