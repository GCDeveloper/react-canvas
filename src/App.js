import React, { Component } from 'react';
import './App.css';
import OpenSimplexNoise from 'open-simplex-noise';

class App extends Component {
  constructor(){
    super();
    this.o = {
      x:0,
      y:0,
      z:0
    }
    this.zoom = this.getZoom();
    this.allowLoop = true;
    this.frame = 0;
    this.startCs = 24;
    this.nMaps = 14;

    this.openSimplex = new OpenSimplexNoise(Date.now());
  }
  reset = () => {
    this.cs = this.createCs(this.startCs);
    this.noiseMap = this.mapNoise(this.nMaps);
  }
  createCs = (n) => {
    const { w, h } = this;
    const cs = [];
    const ar = 1;//Math.random()*4;
    for(let i = 0; i < n; i++){
      cs.push({
        x: (i/n*2)*w-w/2*ar,//Math.random()*w-w/2,
        y: (i/n*2)*h-h/2*ar,//Math.random()*h-h/2,
        z: (i/n/10)*h/2,//Math.random()*6+0.5,
        vx: (n-(i+1))/8,//Math.random()*6-3,
        vy: -(n-(i+1))/8,//Math.random()*6-3,
        vz: -0.01,//(i/n)/3,//Math.random()*0.02-0.01,
        r: 10,//Math.random()*4+1
      })
    }
    return cs;
  }
  update(frame){
    this.cs.forEach(({x,y,z,vx,vy,vz,r,...rest}, i) => {
      const ci = {
        x: x+vx,
        y: y+vy,
        z: z+vz,
        vx,
        vy,
        vz,
        r,
        ...rest
      }
      this.cs[i] = ci;
      this.cs.forEach(({x: jx,y: jy,z: jz,vx: jvx,vy: jvy,vz: jvz, r: jr, ...rest}, j) => {
        //if jx is right of x
        //jvx should decrement
        if(i !== j){
          //if range is big
          const xd = (x-jx);
          const yd = (y-jy);
          const zd = (z-jz);
          const d = ((xd**2)+(yd**2)+(zd**2))**0.5;
          //if(d < r+jr){
          //  jvx = -vx;
          //  jvy = -vy;
          //  jvz = -vz;
          //}
          jvx += xd/d**2;
          jvy += yd/d**2;
          jvz += zd/d**2;///((this.w+this.height)/2);

          const cj = {
            ...this.cs[j],
            vx: jvx,
            vy: jvy,
            vz: jvz,
            r: jr
          }
          this.cs[j] = cj;
        }
      });

    });
    const avgPos = this.cs.reduce((acc, {x,y,z}) => {
      return {
        x: acc.x+x,
        y: acc.y+y,
        z: acc.z+z
      }
    }, {x:0,y:0,z:0});
    avgPos.x /= this.cs.length;
    avgPos.y /= this.cs.length;
    avgPos.z /= this.cs.length;
    this.o = avgPos;
    this.zoom = this.getZoom();
  }
  draw(frame){
    const { ctx, zoom, w, h } = this;
ctx.fillStyle='rgba(255,255,255,0.1)';
    //ctx.fillStyle = `rgba(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},0.1)`; // The closer to black the better
    //ctx.fillRect(0, 0, w, h)
    //if(frame % 32 < 8){
    //} else if(frame % 32 < 16){
  //    ctx.globalCompositeOperation = 'hue'; // reset to default value
    //} else if(frame % 32 < 24){
    //  ctx.globalCompositeOperation = 'exclusion'; // reset to default value
  //  } else {
  //    ctx.globalCompositeOperation = 'xor'; // reset to default value
    //}
    //if(frame%4==0) ctx.globalCompositeOperation = 'xor' // reset to default value
    //if(frame%4==1) ctx.globalCompositeOperation = 'exclusion' // reset to default value
    //if(frame%4==2) ctx.globalCompositeOperation = 'hue' // reset to default value
    ctx.beginPath();
    this.cs.forEach(({x,y,z,r}) => {
      z = z/zoom+zoom/((this.o.z**0.5)*2);//*((Math.cos(frame/20)+2));
      x -= this.o.x;
      y -= this.o.y;
      const xMid = w/2;
      const nox = (x-xMid);
      const yMid = h/2;
      const noy = (h-yMid);
      const newR = Math.max(r/(z), 0)*0.5;

      ctx.moveTo(x/(z)+newR+xMid, y/(z)+yMid);
      ctx.arc(x/(z)+xMid,y/(z)+yMid,newR,0,Math.PI*2);
    });
    // if(frame % 2 === 0){
    //   const r = Math.random()*w*0.01+(2*0.005);
    //   const x = Math.random()*w;
    //   const y = Math.random()*h;
    //   ctx.moveTo(x+r,y);
    //   ctx.arc(x,y,r,0,Math.PI*2);
    //
    //
    // }
    ctx.closePath();
    ctx.fill();
      this.noiseMap[frame%this.nMaps] = this.mapNoise(1, frame)[0];
      if(frame === 0){
        //ctx.fillStyle = 'rgba(255,255,255,1)';
        //ctx.fillRect(0,0,w,h);
        this.zoom = 8;
        ctx.putImageData(this.mapNoise(1, 10)[0], 0, 0);

      }
    if(frame%440 < 220){
      ctx.globalCompositeOperation = 'source-in';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    this.postProcess(frame);
  }
  mapNoise = (n, frame) => {
    const imageData = [];
    for(let k = 0; k < n ; k++){
      if(typeof frame === 'undefined'){
        frame = k;
      }
      const { ctx, zoom, w, h } = this;
      const openSimplex = new OpenSimplexNoise(frame);
      //if(k%2 === 0 && k > 0) {
      //  imageData[k] = imageData[k-1];
      //  continue;
      //}
      imageData[k] = ctx.createImageData(w, h);
     // const openSimplex = new OpenSimplexNoise(seed);
     const r = Math.floor(Math.random()*256);
     const g = Math.floor(Math.random()*256);
     const b = Math.floor(Math.random()*256);
      for (let x = 0; x < w; x++) {

        for (let y = 0; y < h; y++) {
          const i = (x + y * w) * 4;

          //const valueA = (openSimplex.noise2D(x / zoom , y / zoom, frame/40) + 1);
          //const valueB = (openSimplex.noise2D(x / zoom*2 , y / zoom*2, frame/40) + 1);
          const val = (openSimplex.noise3D(x / zoom / (frame % this.nMaps) , y / zoom / (frame % this.nMaps), frame/this.nMaps/10) + 1);
         // const dist = 1-Math.sqrt((x-w/2)**2+(y-h/2)**2)/Math.min(w,h)*2;
          //const val = valueB*dist*255 > 128? valueB : valueA;
         // const val = Math.sin(frame/16)+1;//valueA;
          imageData[k].data[i] = r*val;
          imageData[k].data[i + 1] = g*val;
          imageData[k].data[i + 2] = b*val;
          imageData[k].data[i + 3] = 255;
        }
      }
    }
    return imageData;
  }
  postProcess(frame){
    const { ctx, zoom, seed, w, h, openSimplex } = this;
     const imageData = ctx.getImageData(0, 0, w, h);
    // const openSimplex = new OpenSimplexNoise(seed);
    const r = Math.random()*0.03+0.96;
    const g = Math.random()*0.03+0.96;
    const b = Math.random()*0.03+0.96;
     for (let x = 0; x < w; x++) {
       for (let y = 0; y < h; y++) {

         //const valueA = (openSimplex.noise2D(x / zoom , y / zoom, frame/40) + 1);
         //const valueB = (openSimplex.noise2D(x / zoom*2 , y / zoom*2, frame/40) + 1);
         //const val = this.noiseMap[i];//(x / zoom , y / zoom) + 1)/2;
         const angle = Math.atan2(y-(h/2), x-(w/2)) * (180) / Math.PI + (Math.sin(frame/80)*Math.PI);
         const dist = Math.max(0.1,(1-Math.sqrt((x-(w/2+(Math.cos(frame/50)*10)))**2+(y-(h/2+(Math.sin(frame/50)*10)))**2)/Math.min(w,h)*2)*(32+(Math.cos(frame/30)*6)))
         const ax = x+Math.round(Math.cos(angle)*dist);
         const ay = y+Math.round(Math.sin(angle)*dist);
         const i = (x + y * w) * 4;
         const j = (ax + ay * w) * 4;
         //const val = valueB*dist*255 > 128? valueB : valueA;
        // const val = Math.sin(frame/16)+1;//valueA;
         imageData.data[i] -= (imageData.data[i]-this.noiseMap[frame%this.nMaps].data[i])/(this.nMaps*6);
         imageData.data[i + 1] -= (imageData.data[i + 1]-this.noiseMap[frame%this.nMaps].data[i + 1])/(this.nMaps*6);
         imageData.data[i + 2] -= (imageData.data[i + 2]-this.noiseMap[frame%this.nMaps].data[i + 2])/(this.nMaps*6);
         imageData.data[i + 3] = 255;
         imageData.data[i] -= (imageData.data[i]-imageData.data[j])/(32+(Math.sin(frame/20)*6));
         imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[j + 1])/(32+(Math.sin(frame/20)*6));
         imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[j + 2])/(232+(Math.sin(frame/20)*6));
         if( x > 4 && x < w-4 && y > 4 && y < h-4){
            let l = (x-(1) + y * w) * 4;
            let r = (x+(1) + y * w) * 4;
            let u = (x + (y-(1)) * w) * 4;
            let d = (x + (y+(1)) * w) * 4;

            //if(x > w/2){
            //  l = r;
          //  }
          //  if(y > h/2){
            //  d = u;
          //  }
           //if(x < w){

           if(frame%4===0){
             imageData.data[i] -= (imageData.data[i]-imageData.data[l])/9;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[l + 1])/9;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[l + 2])/9;
           }
           if(frame%4===1){
             imageData.data[i] -= (imageData.data[i]-imageData.data[d])/9;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[d + 1])/9;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[d + 2])/9;
           }
           //}
          // if(x > 0){
          if(frame%4===2){
             imageData.data[i] -= (imageData.data[i]-imageData.data[r])/9;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[r + 1])/9;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[r + 2])/9;
           }
        //  }
        //   if(y < h){

          // }
          // if(y > 0){
          if(frame%4===3){
             imageData.data[i] -= (imageData.data[i]-imageData.data[u])/9;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[u + 1])/9;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[u + 2])/9;
           }
          // }
         }
       }
     }
     ctx.putImageData(imageData, 0, 0);
  }
  getZoom(){
    return Math.pow((this.w+this.h)/2, 0.5);
  }
  loop(){
    //this.cs.push(this.createCs(1)[0]);
    //this.startCs++;
    if(this.allowLoop){
      this.update(this.frame)
      //while(this.frame < 100){
        this.draw(this.frame);
        this.frame ++;
    //  }
      requestAnimationFrame(()=>this.loop());
    }
  }
  resize(){
    this.w = 320;//window.innerWidth;
    this.h = 320;//window.innerHeight;
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
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.fillStyle = 'rgb(255,255,255)';
    this.cs = this.createCs(this.startCs);
    this.noiseMap = this.mapNoise(this.nMaps);
    this.loop();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", ()=>{
      this.resize();
    });
  }
  // draw(frame){
  //   const { ctx, zoom, seed, r, g, b } = this;
  //   const w = 800;
  //   const h = 600;
  //   const imageData = ctx.createImageData(w, h);
  //   const openSimplex = new OpenSimplexNoise(seed);
  //
  //   for (let x = 0; x < w; x++) {
  //     for (let y = 0; y < h; y++) {
  //       const i = (x + y * w) * 4;
  //       const valueA = (openSimplex.noise3D(x / zoom , y / zoom, frame/40) + 1);
  //       const valueB = (openSimplex.noise3D(x / zoom*2 , y / zoom*2, frame/40) + 1);
  //       //const valueC = (openSimplex.noise3D(x / zoom*4 , y / zoom*4, frame/40) + 1);
  //       const dist = 1-Math.sqrt((x-w/2)**2+(y-h/2)**2)/Math.min(w,h)*2;
  //       const val = valueB*dist*255 > 128? valueB : valueA;
  //       imageData.data[i] = val*r;
  //       imageData.data[i + 1] = val*g;
  //       imageData.data[i + 2] = val*b;
  //       imageData.data[i + 3] = 255;
  //     }
  //   }
  //   ctx.putImageData(imageData, this.w/2-w/2, this.h/2-h/2);
  // }
  render() {
    return (
      <div className="App">
        <canvas ref={(el)=>this.canvasElement = el} onClick={()=>this.reset()}></canvas>
      </div>
    );
  }
}

export default App;
