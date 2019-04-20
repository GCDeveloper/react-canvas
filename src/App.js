import React, { Component } from 'react';
import './App.css';
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 30);//fallback to setTimeout
		  };
})();

class App extends Component {
  componentDidMount(){
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    this.ctx = this.canvasElement.getContext('2d');
    this.loop();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", ()=>{
      this.resize();
    });
  }
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
  }
  update(){

  }
  draw(){
    const { ctx, w, h } = this;
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  }
  loop(){
    this.update();
    this.draw();
    window.requestAnimFrame(this.loop.bind(this));
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
