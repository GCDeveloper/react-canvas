import React, { Component } from 'react';
import './App.css';
let dots = [];
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
    let dotsToSpawn = 1;
    for(let i=0;i < dotsToSpawn;i++){
      dots.push({
        x: ox,
        y: oy,
        vx:0,
        vy:0,
        r: 1
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
