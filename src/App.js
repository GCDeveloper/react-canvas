import React, { Component } from 'react';
import './App.css';
import OpenSimplexNoise from 'open-simplex-noise';

class App extends Component {
  constructor(){
    super();
    this.zoom = this.getZoom();
    this.allowLoop = true;
    this.seed = Date.now();
    console.log("seed:", this.seed);
    this.frame = 0;
    this.r = Math.floor(Math.random()*128+128);
    this.g = Math.floor(Math.random()*128+128);
    this.b = Math.floor(Math.random()*128+128);
  }
  getZoom(){
    return (Math.sqrt(this.w+this.h)/2)*4;
  }
  loop(){
    if(this.allowLoop){
      this.draw(this.frame);
      this.frame ++;
      requestAnimationFrame(()=>this.loop());
    }
  }
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
    this.zoom = this.getZoom();
  }
  componentDidMount(){
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    this.ctx = this.canvasElement.getContext('2d');
    this.loop();
  }
  draw(frame){
    const { ctx, zoom, seed, r, g, b } = this;
    const w = 800;
    const h = 600;
    const imageData = ctx.createImageData(w, h);
    const openSimplex = new OpenSimplexNoise(seed);

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const i = (x + y * w) * 4;
        const valueA = (openSimplex.noise3D(x / zoom , y / zoom, frame/40) + 1);
        const valueB = (openSimplex.noise3D(x / zoom*2 , y / zoom*2, frame/40) + 1);
        //const valueC = (openSimplex.noise3D(x / zoom*4 , y / zoom*4, frame/40) + 1);
        const dist = 1-Math.sqrt((x-w/2)**2+(y-h/2)**2)/Math.min(w,h)*2;
        const val = valueB*dist*255 > 128? valueB : valueA;
        imageData.data[i] = val*r;
        imageData.data[i + 1] = val*g;
        imageData.data[i + 2] = val*b;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, this.w/2-w/2, this.h/2-h/2);
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
