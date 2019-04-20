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
  constructor(props){
    super(props);
    this.ox = 0;
    this.oy = 0;
    this.pixelIds = [
      {
        colour: "white"
      },
      {
        colour: "green"
      },
      {
        colour: "red"
      },
      {
        colour: "yellow",
        onTick: (cell) => {
          cell.spread(2);
        }
      },
      {
        colour: "purple",
        onTick: (cell) => {
          cell.spread(2);
        }
      }
    ]
  }
  //init
  componentDidMount(){
    //setup canvas size to take entire viewport
    //and ensure it is resized when viewport size changes
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    //get the canvas context
    this.ctx = this.canvasElement.getContext('2d');
    //create starting pixels
    this.pixels = [
      [0, 0],
      [0, 0]
    ];
    //begin loop which updates/draws each frame
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
  clickCellAtPosition(x,y){
    const { w, h } = this;
    
  }
  update(){
    const { w, h, pixels } = this;
    //determine rows, cols, and cell size
    const rows = pixels[0].length;
    const cols = pixels.length;
    this.rows = rows;
    this.cols = cols;
    const cellWidth = w/rows;
    const cellHeight = h/cols;
    const cellSize = Math.min(cellWidth, cellHeight);
    this.cellSize = cellSize;
    //determine offset x/y
    if(h > w){
      this.ox = 0;
      this.oy = h/2-(cellSize*cols/2);
    } else if(w > h){
      this.ox = w/2-(cellSize*rows/2);
      this.oy = 0;
    }
  }
  draw(){
    const { ctx, w, h, rows, cols, cellSize, pixels, pixelIds, ox, oy } = this;
    ctx.clearRect(0,0,w,h);
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(w, h);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'black';
    // ctx.stroke();
    // ctx.closePath();
    ctx.strokeStyle = 'black';
    for(let x = 0; x < cols; x++){
      for(let y = 0; y < rows; y++){
        const pixel = pixelIds[pixels[x][y]];
        ctx.fillStyle = pixel.colour;
        ctx.fillRect(ox+(x*cellSize), oy+(y*cellSize), cellSize, cellSize);
        ctx.rect(ox+(x*cellSize), oy+(y*cellSize), cellSize, cellSize);
        ctx.stroke();
      }
    }
  }
  loop(){
    this.update();
    this.draw();
    window.requestAnimFrame(this.loop.bind(this));
  }
  onClick = (e) => {
    const x = e.pageX || e.touches.length && e.touches.length > 0 && e.touches[0].pageX;
    const y = e.pageY || e.touches.length && e.touches.length > 0 && e.touches[0].pageY;
    this.clickCellAtPosition(x,y);
  }
  render() {
    return (
      <div className="App">
        <canvas
        ref={(el)=>this.canvasElement = el}
        onClick={this.onClick}
        ></canvas>
      </div>
    );
  }
}

export default App;
