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
  createPixelDefinition({
    colour,
    owner = 'empty',
    onClick = Function.prototype,
    onTick = Function.prototype
  }){
    if(!colour) throw new Error("colour required");
    return {
      colour,
      onClick,
      onTick,
      owner
    };
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
    //initialize offset x,y
    this.ox = 0;
    this.oy = 0;
    const createPixelDefinition = this.createPixelDefinition;
    //initialise pixel id definitions
    this.pixelIds = [
      createPixelDefinition({
        colour: "white",
        owner: "empty",
        onClick: ()=>{
          return 1;
        }
      }),
      createPixelDefinition({
        colour: "green",
        owner: "player"
      }),
      createPixelDefinition({
        colour: "red",
        owner: "enemy"
      }),
      createPixelDefinition({
        colour: "yellow",
        owner: "player",
        onTick: (cell) => {
          cell.spread(2);
        }
      }),
      createPixelDefinition({
        colour: "purple",
        owner: "enemy",
        onTick: (cell) => {
          cell.spread(2);
        }
      })
    ]
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
  pointInRect(p, rect){
    const { x, y } = p;
    const { x: rx, y: ry, w: rw, h: rh } = rect;
    return (x >= rx && x <= rx+rw && y >= ry && y <= ry+rh);
  }
  clickCellAtPosition(mx,my){
    const mousePos = {
      x: mx,
      y: my
    };
    const { cellSize, rows, cols, ox, oy, pixels, pixelIds } = this;
    for(let x = 0; x < cols; x++){
      for(let y = 0; y < rows; y++){
        const pixel = pixelIds[pixels[x][y]];
        const rect = {
          x: ox+(x*cellSize),
          y: oy+(y*cellSize),
          w: cellSize,
          h: cellSize
        }
        if(this.pointInRect(mousePos, rect)){
          //click this cell
          pixels[x][y] = pixel.onClick() || pixels[x][y];
        }
      }
    }
  }
  update(){
    let { w, h, pixels, pixelIds, rows, cols } = this;
    //if all cells visible are owned by the player
    //expand the map size
    const playerOwnsAll = pixels.every((rows) => {
      return rows.every((pixelId) => {
        const pixel = pixelIds[pixelId];
        return (pixel.owner === 'player');
      })
    });
    if(playerOwnsAll){
      //expand map size
      //expand cols left and right
      const newPixels = [];
      const spread = 1;//+1 column/row per side
      for(let x=-spread;x<cols+spread;x++){
        newPixels.push([]);
        for(let y = -spread; y < rows+spread; y++){
          let pixelId = 0;
          if(x >= 0 && x < cols && y >= 0 && y <rows){
           pixelId = pixels[x][y];
          }
          newPixels[x+spread][y+spread] = pixelId;
        }
      }
      this.pixels = newPixels;
      pixels = this.pixels;
    }
    //determine rows, cols, and cell size
    rows = pixels[0].length;
    cols = pixels.length;
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
