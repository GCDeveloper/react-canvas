import React, { Component } from 'react';
import './App.css';
let dots = [];
let mouseRadius = 150;
let dotRadius = 2.5;
let dotsToSpawn = 100;
class App extends Component {
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
  }
  init(){
    for(let i=0;i < dotsToSpawn;i++){
      dots.push({
        x: Math.random()*this.w,
        y: Math.random()*this.h,
        r: dotRadius
      });
    }
  }
  update(mx, my){
   dots = dots.map(({x,y,r}) => {
     //move x,y of dot away from mouse
     let dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
     let angle = Math.atan2(my-y, mx-x);
     if(dist < mouseRadius){
       x += Math.cos(angle);
       y += Math.sin(angle);
       dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
     }
     return {x,y,r}
   });
  }
  draw(){
    const w = this.w;
    const h = this.h;
   const ctx = this.ctx;
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
  loop(){
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
      this.update(e.pageX, e.pageY);
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
