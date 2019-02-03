import React, { Component } from 'react';
import './App.css';

class App extends Component {
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
  }
  componentDidMount(){
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    this.ctx = this.canvasElement.getContext('2d');
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.w, this.h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
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
