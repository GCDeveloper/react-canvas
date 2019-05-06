import React, { Component } from 'react';
import './App.css';
let dots = [];
let mx = 0;
let my = 0;
let ox = 0;
let oy = 0;
let tx, ty;
let frame = 0;
class App extends Component {
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
ox = -this.w/2;
oy = -this.h/2;
  }
  init(){
    const w = this.w;
    const h = this.h;
    let dotsToSpawn = 1;
    for(let i=0;i < dotsToSpawn;i++){
      dots.push({
        x: ox,
        y: oy,
        vx:0,
        vy:0,
        r: 2
      });
    }
  }
  update(mx, my){
    let bnd = v => Math.abs(Math.min(v,2))-1;
    tx = bnd(Math.cos(frame/100)+Math.cos(frame/50));
    ty = bnd(Math.sin(frame/50)*Math.sin(frame/50));
    const w = this.w;
    const h = this.h;
    let xCount = 0;
    let yCount = 0;
    //const wh = w*h;
    console.log(frame);
    dots = dots.map(({x,y,vx,vy,r}, i) => {
     // xCount += x;
     // yCount += y;

      x = tx*w/4;
      y = ty*h/4;
      return {x,y,vx,vy,r}
    });
//    ox = xCount/dots.length-w/2;
//    oy = yCount/dots.length-h/2;
  }
  draw(){
    const w = this.w;
    const h = this.h;
    const ctx = this.ctx;
    if(frame % 10 === 0) {
      ctx.fillStyle='rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,w,h);
    }
    ctx.beginPath();
    dots.forEach(({x,y,r}) => {
      ctx.moveTo(Math.round(x+r-ox), Math.round(y-oy));
      ctx.arc(Math.round(x-ox), Math.round(y-oy), r, 0, Math.PI*2);
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
