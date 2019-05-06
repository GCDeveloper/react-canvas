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
  onClick = () => {
    this.xtype = Math.random() > 0.5 ? 'sin' : 'cos';
    this.ytype = Math.random() > 0.5 ? 'sin' : 'cos';
    this.xi = Math.ceil(Math.random()*6);
    this.yi = Math.ceil(Math.random()*6);
    this.db = Math.random()*100+50;
    const ctx = this.ctx;
    ctx.fillStyle='rgba(0,0,0,1)';
    ctx.fillRect(0,0,this.w,this.h);
    this.prev = {x: null, y:null};
  }
  update(mx, my){
    let wav = (iteration, {frame, prevVal = 1, iterations, type, divideBy, divideChanger}) => {
      let vals = [];
      let fn;
      for(let i=0;i<iterations;i++){
        let poop;
        if(type === 'sin') {
          type = 'cos';
          poop = Math.sin(frame/divideBy);
        } else if(type === 'cos'){
          type = 'sin';
          poop = Math.cos(frame/divideBy);
        }
        vals.push(poop);
        divideBy = divideChanger(divideBy);
      }
      let output = 0;
      vals.forEach((val, i)=>{
        if(i === 0){
          output = val;
        } else {
          output *= val;
        }
      })
      return output;
    }
    const { xtype, ytype, xi, yi, db } = this;
    tx = wav(0, {
      frame,
      type:xtype,
      iterations:xi,
      divideBy:db,
      divideChanger: (v)=>v/2
    });
    ty = wav(0, {
      frame,
      type:ytype,
      iterations:yi,
      divideBy:db,
      divideChanger: (v)=>v/2
    });
    //tx = Math.sin(frame/100);
    //ty = Math.cos(frame/100);
    const w = this.w;
    const h = this.h;
    let xCount = 0;
    let yCount = 0;
    //const wh = w*h;
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
  prev = {
    x: null,
    y: null
  }
  
  draw(){
    let prev = this.prev;
    const w = this.w;
    const h = this.h;
    const ctx = this.ctx;
    if(frame <= 1){
      ctx.fillStyle='rgba(0,0,0,1)';
      ctx.fillRect(0,0,w,h);
    }
    if(frame % 40 === 0) {
      ctx.fillStyle='rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,w,h);
    }
    
    ctx.beginPath();
    dots.forEach(({x,y,r}) => {
      console.log()
      if(prev.x !== null && prev.y !== null){
        ctx.moveTo(Math.round(prev.x-ox), Math.round(prev.y-oy));
        ctx.lineTo(Math.round(x-ox), Math.round(y-oy));
      }
       // ctx.moveTo(Math.round(x+r-ox), Math.round(y-oy));
      //  ctx.arc(Math.round(x-ox), Math.round(y-oy), r, 0, Math.PI*2);
    
      this.prev = {
        x,
        y
      }
    });
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'red';
    ctx.fill();
    ctx.stroke();
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
        <canvas ref={(el)=>this.canvasElement = el} onClick={this.onClick}></canvas>
      </div>
    );
  }
}

export default App;
