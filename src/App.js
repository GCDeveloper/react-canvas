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
  resize() {
    this.w = 640; //window.innerWidth;
    this.h = 640; //window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
    ox = -this.w / 2;
    oy = -this.h / 2;
  }
  init() {
    const w = this.w;
    const h = this.h;
    let dotsToSpawn = 1;
    for (let i = 0; i < dotsToSpawn; i++) {
      dots.push({
        x: ox,
        y: oy,
        vx: 0,
        vy: 0,
        r: 2,
      });
    }
  }
  xtype = 'sin';
  ytype = 'cos';
  xi = 3;
  yi = 2;
  db = 50;
  randomColour = () => {
    const rnd = () => Math.floor(Math.random() * 256);
    return `rgb(${rnd()},${rnd()},${rnd()})`;
  };
  onMouseDown = e => {
    this.mouseIsDown = true;
  };
  onMouseUp = e => {
    this.mouseIsDown = false;
  };
  onMouseMove = e => {
    if (!this.mouseIsDown) return;
    const r = 20;
    const rect = e.target.getBoundingClientRect();
    const x = (e.pageX - rect.x) * 1.07 - r;
    const y = (e.pageY / this.w) * this.h * 1.065 - 2;
    // const x = this.w / 2;
    // const y = this.h / 2;
    console.log(x, y);
    this.xtype = Math.random() > 0.5 ? 'sin' : 'cos';
    this.ytype = Math.random() > 0.5 ? 'sin' : 'cos';
    this.xi = Math.ceil(Math.random() * 6);
    this.yi = Math.ceil(Math.random() * 6);
    this.db = Math.random() * 100 + 50;
    const ctx = this.ctx;
    // ctx.fillStyle = 'rgba(0,0,0,1)';
    // ctx.fillRect(0, 0, this.w, this.h);
    this.prev = { x: null, y: null };
    //for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const d = 0; //Math.random() * r * 7;
    const xen = Math.cos(angle) * d;
    const yen = Math.sin(angle) * d;
    ctx.fillStyle = this.randomColour();
    ctx.beginPath();
    ctx.moveTo(x + xen, y + yen);
    ctx.arc(x + r + xen, y + yen, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    //}
  };
  update(mx, my) {
    let wav = (
      iteration,
      { frame, prevVal = 1, iterations, type, divideBy, divideChanger }
    ) => {
      let vals = [];
      let fn;
      for (let i = 0; i < iterations; i++) {
        let poop;
        if (type === 'sin') {
          type = 'cos';
          poop = Math.sin(frame / divideBy);
        } else if (type === 'cos') {
          type = 'sin';
          poop = Math.cos(frame / divideBy);
        }
        vals.push(poop);
        divideBy = divideChanger(divideBy);
      }
      let output = 0;
      vals.forEach((val, i) => {
        if (i === 0) {
          output = val;
        } else {
          output *= val;
        }
      });
      return output;
    };
    const { xtype, ytype, xi, yi, db } = this;
    tx = wav(0, {
      frame,
      type: xtype,
      iterations: xi,
      divideBy: db,
      divideChanger: v => {
        return v / 2;
      },
    });
    ty = wav(0, {
      frame,
      type: ytype,
      iterations: yi,
      divideBy: db,
      divideChanger: v => {
        return v / 2;
      },
    });
    //tx = Math.sin(frame/100);
    //ty = Math.cos(frame/100);
    const w = this.w;
    const h = this.h;
    let xCount = 0;
    let yCount = 0;
    //const wh = w*h;
    dots = dots.map(({ x, y, vx, vy, r }, i) => {
      // xCount += x;
      // yCount += y;

      x = (tx * w) / 4;
      y = (ty * h) / 4;
      return { x, y, vx, vy, r };
    });
    //    ox = xCount/dots.length-w/2;
    //    oy = yCount/dots.length-h/2;
  }
  postProcess(frame) {
    const { ctx, w, h } = this;
    const imageData = ctx.getImageData(0, 0, w, h);
    // const openSimplex = new OpenSimplexNoise(seed);
    const r = Math.random() * 0.03 + 0.96;
    const g = Math.random() * 0.03 + 0.96;
    const b = Math.random() * 0.03 + 0.96;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        //const valueA = (openSimplex.noise2D(x / zoom , y / zoom, frame/40) + 1);
        //const valueB = (openSimplex.noise2D(x / zoom*2 , y / zoom*2, frame/40) + 1);
        //const val = this.noiseMap[i];//(x / zoom , y / zoom) + 1)/2;
        const angle =
          (Math.atan2(y - h / 2, x - w / 2) * 180) / Math.PI +
          Math.sin(frame / 80) * Math.PI;
        const dist = Math.max(
          0.1,
          (1 -
            (Math.sqrt(
              (x - (w / 2 + Math.cos(frame / 50) * 10)) ** 2 +
                (y - (h / 2 + Math.sin(frame / 50) * 10)) ** 2
            ) /
              Math.min(w, h)) *
              (3.5 + Math.cos(frame / 20) * 0.5)) *
            (32 + Math.cos(frame / 30) * 6)
        );
        const dist2 =
          (1 -
            Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2) /
              ((w + h) / (Math.sin(frame / 40) * 2 + 3))) *
          ((frame % 1000) / (Math.sin(frame / 500) * 250 + 750));
        const ax = x + Math.round(Math.cos(angle) * dist);
        const ay = y + Math.round(Math.sin(angle) * dist);
        const i = (x + y * w) * 4;
        const j = (ax + ay * w) * 4;
        if (
          imageData.data[i] > 0 ||
          imageData.data[i + 1] > 0 ||
          imageData.data[i + 2] > 0
        ) {
          //const val = valueB*dist*255 > 128? valueB : valueA;
          // const val = Math.sin(frame/16)+1;//valueA;
          imageData.data[i + 3] = 255;
          // imageData.data[i] -= (imageData.data[i]-imageData.data[j])/(32+(Math.sin(frame/20)*6))*dist2;
          // imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[j + 1])/(32+(Math.sin(frame/20)*6))*dist2;
          // imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[j + 2])/(232+(Math.sin(frame/20)*6))*dist2;
          if (x > 4 && x < w - 4 && y > 4 && y < h - 4) {
            //if (frame % 2 === 0) {
            for (let ic = 0; ic < 3; ic++) {
              // let l = (x - 1 + y * w) * 4;
              // let r = (x + 1 + y * w) * 4;
              // let u = (x + (y - 1) * w) * 4;
              // let d = (x + (y + 1) * w) * 4;

              //let lu = (x - 1 + (y - 1) * w) * 4;
              //x,y,value
              let kernel = [
                //top
                [0, -1, 1, 2],
                //right
                [1, 0, 1, 3],
                //bottom
                [0, 1, 1, 0],
                //left
                [-1, 0, 1, 1],
                //top-left
                [-1, -1, 0.5, 6],
                //top-right
                [1, -1, 0.5, 7],
                //bottom-right
                [1, 1, 0.5, 4],
                //bottom-left
                [-1, 1, 0.5, 5],
              ];
              kernel = kernel.map(([kx, ky, magnitude, oppositeKI]) => {
                //oppositeKI = Math.floor(Math.random() * kernel.length);
                //calc the index and initial/previous value
                const index = (x + kx + (y + ky) * w) * 4;
                const value = imageData.data[index + ic];
                return {
                  index,
                  value,
                  magnitude,
                  oppositeKI,
                };
              });
              //tranform the value using the opposite pixel
              kernel = kernel.map(({ index, value, magnitude, oppositeKI }) => {
                const opposite = kernel[oppositeKI];
                value += opposite.value / 32;
                if (Math.abs(opposite.value - value) > 64) {
                  value *= Math.abs(opposite.value - value) / 256;
                }
                return {
                  index,
                  value,
                  magnitude,
                  oppositeKI,
                  opposite,
                };
              });
              //apply changes to the data.
              kernel.forEach(({ index, value }) => {
                imageData.data[index + ic] = value;
              });
              //for each pixel in kernel,
              //add value of opposite pixel / 64 with magnitude
              // kernel.forEach(({ index, magnitude, oppositeKI }) => {
              //   const opposite = kernel[oppositeKI];
              //   imageData.data[index] +=
              //     (imageData.data[opposite.index] / 64) * magnitude;
              // });
              // imageData.data[l] += imageData.data[r] / 64;
              // imageData.data[r] += imageData.data[l] / 64;
              // imageData.data[u] += imageData.data[r] / 64;
              // imageData.data[d] += imageData.data[l] / 64;

              //imageData.data[lu] += imageData.data[r] / 96;

              // if (Math.abs(imageData.data[l] - imageData.data[r]) < 64) {
              //   imageData.data[l] *= 0.975;
              //   imageData.data[r] *= 0.975;
              // }
              // if (Math.abs(imageData.data[u] - imageData.data[d]) < 64) {
              //   imageData.data[u] *= 0.975;
              //   imageData.data[d] *= 0.975;
              // }
              // imageData.data[l + ic] +=
              //   ((imageData.data[r + ic] +
              //     imageData.data[r + ic] +
              //     imageData.data[r + ic]) /
              //     3 -
              //     imageData.data[l + ic]) /
              //   8;
              // //}
              // //if (frame % 2 === 0) {
              // imageData.data[r + ic] +=
              //   ((imageData.data[l + ic] +
              //     imageData.data[l + ic] +
              //     imageData.data[l + ic]) /
              //     3 -
              //     imageData.data[r + ic]) /
              //   8;
              // // }
              // //if (frame % 2 === 0) {
              // imageData.data[u + ic] +=
              //   ((imageData.data[r + ic] +
              //     imageData.data[r + ic] +
              //     imageData.data[r + ic]) /
              //     3 -
              //     imageData.data[u + ic]) /
              //   8 /
              //   1;
              // // }
              // // if (frame % 2 === 0) {
              // imageData.data[d + ic] +=
              //   ((imageData.data[l + ic] +
              //     imageData.data[l + ic] +
              //     imageData.data[l + ic]) /
              //     3 -
              //     imageData.data[d + ic]) /
              //   8;
            }
            // }

            // imageData.data[l] += imageData.data[u] / 64;
            // imageData.data[r] += imageData.data[d] / 64;
            // imageData.data[u] += imageData.data[r] / 64;
            // imageData.data[d] += imageData.data[l] / 64;

            // if (Math.abs(imageData.data[l] - imageData.data[r]) < 64) {
            //   imageData.data[l] *= 0.99;
            //   imageData.data[r] *= 0.99;
            // }
            // if (Math.abs(imageData.data[u] - imageData.data[d]) < 64) {
            //   imageData.data[u] *= 0.99;
            //   imageData.data[d] *= 0.99;
            // }

            //  if(Math.random() > 0.5){
            //   imageData.data[l+1] += Math.round(Math.sin(frame/10)*2);
            //  }
            //  if(Math.random() > 0.5){
            //   imageData.data[r+1] += Math.round(Math.sin(frame/20)*2);
            //  }
            //  if(Math.random() > 0.5){
            //   imageData.data[u+1] += Math.round(Math.sin(frame/30)*2);
            //  }
            //  if(Math.random() > 0.5){
            //   imageData.data[d+1] += Math.round(Math.sin(frame/40)*2);
            //  }

            // imageData.data[l + 1] += Math.floor(Math.random()*2);
            // imageData.data[r + 1] += Math.floor(Math.random()*2);
            // imageData.data[u + 1] += Math.floor(Math.random()*2);
            // imageData.data[d + 1] += Math.floor(Math.random()*2);

            // imageData.data[l + 2] += Math.floor(Math.random()*2);
            // imageData.data[r + 2] += Math.floor(Math.random()*2);
            // imageData.data[u + 2] += Math.floor(Math.random()*2);
            // imageData.data[d + 2] += Math.floor(Math.random()*2);
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
  prev = {
    x: null,
    y: null,
  };

  draw() {
    let prev = this.prev;
    const w = this.w;
    const h = this.h;
    const ctx = this.ctx;
    if (frame <= 1) {
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, w, h);
    }
    // if (frame % 40 === 0) {
    //   ctx.fillStyle = 'rgba(0,0,0,0.05)';
    //   ctx.fillRect(0, 0, w, h);
    // }

    const r = Math.floor(Math.sin((frame + 20) / 60.7) * 100 + 156);
    const g = Math.floor(Math.sin((frame + 10) / 43.4) * 100 + 156);
    const b = Math.floor(Math.sin(frame / 52.3) * 100 + 156);
    dots.forEach(({ x, y }) => {
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      if (prev.x !== null && prev.y !== null) {
        //ctx.moveTo(Math.round(prev.x - ox), Math.round(prev.y - oy));
        // ctx.lineTo(Math.round(x - ox), Math.round(y - oy));
      }
      ctx.closePath();
      ctx.stroke();
      // ctx.moveTo(Math.round(x+r-ox), Math.round(y-oy));
      //  ctx.arc(Math.round(x-ox), Math.round(y-oy), r, 0, Math.PI*2);

      this.prev = {
        x,
        y,
      };
    });

    //ctx.fillStyle = 'white';

    //ctx.fill();

    this.postProcess(frame);
  }
  loop() {
    frame++;
    this.update(mx, my);
    this.draw();

    // while (frame % 40 !== 0) {
    //   return this.loop();
    // }
    //console.log('req anim frame');
    requestAnimationFrame(() => {
      this.loop();
    });
  }
  componentDidMount() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
    });
    document.addEventListener('mousemove', e => {
      mx = e.pageX;
      my = e.pageY;
    });
    this.ctx = this.canvasElement.getContext('2d');
    this.init();
    this.loop();
  }
  render() {
    return (
      <div className='App'>
        <canvas
          ref={el => (this.canvasElement = el)}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onClick={e => {
            this.onMouseDown(e);
            this.onMouseMove(e);
            this.onMouseUp(e);
          }}
        />
      </div>
    );
  }
}

export default App;
