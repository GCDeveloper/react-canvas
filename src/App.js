import React, { Component } from 'react';
import './App.css';
import OpenSimplexNoise from 'open-simplex-noise';
let mouseRadius = 80;
let dotRepelRadius = 10;
let dotRadius = 2.5;
let dotsToSpawn = 100;
let mx = 0;
let my = 0;
let ox = 0;
let oy = 0;
let frameDots = 0;
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
    this.startCs = 48;
    this.nMaps = 14;
    this.dots = [];
    this.openSimplex = new OpenSimplexNoise(Date.now());
  }
  reset = (n = 1) => {
    this.startCs = Math.max(12, Math.floor(this.startCs*n));
    //this.nMaps = Math.floor(this.nMaps*n);
    this.frame = 0;
    frameDots = 0;
    this.cs = this.createCs(this.startCs);
    this.noiseMap = this.mapNoise(this.nMaps);
    this.initDots();
  }
  initDots = () => {
    const w = this.w;
    const h = this.h;
    let dotsToSpawn = Math.floor(((w+h)/2)/10);
    this.dots = [];
    for(let i=0;i < dotsToSpawn;i++){
      this.dots.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx:Math.random()*2-1,
        vy:Math.random()*2-1,
        r: Math.random()*4+1
      });
    }
  }
  updateDots = (mx, my) => {
    const w = this.w;
    const h = this.h;
    let xCount = 0;
    let yCount = 0;
    let frame = frameDots;
    //const wh = w*h;
    this.dots = this.dots.map(({x,y,vx,vy,r}, i) => {

      //let distFromCenter = Math.sqrt(((w/2-x)**2)+((h/2-y)**2));
      //move x,y of dot away from mouse
      //let dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
      //let angle = Math.atan2(my-y, mx-x);
      //if(dist < mouseRadius){
      // x += Math.cos(angle)*(mouseRadius/dist);
      // y += Math.sin(angle)*(mouseRadius/dist);
       //dist = Math.sqrt(((mx-x)**2)+((my-y)**2));
      //}
      this.dots.forEach((d, j) => {
        if(i !== j){
          let dist = Math.sqrt(((d.x-x)**2)+((d.y-y)**2));
          let angle = Math.atan2(d.y-y, d.x-x);
          let xWarp = (r*d.r);
          let yWarp = (r*d.r);
          if(frame < 385+(i+j)){
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
            }
          } else if(frame < 450+(i)){
            mouseRadius += Math.abs(Math.sin(frame/(xWarp**2)));
            //angle += Math.PI*(distFromCenter/wh);
            angle += Math.PI*((frame-385)*0.01);
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/xWarp));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/yWarp));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/xWarp));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/yWarp));
            }
          } else if(frame < 1150+(i)){
            mouseRadius = 250;
            angle += Math.PI*((frame-675)*0.02);
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/80));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/80));
            }
          } else if(frame < 1865+(i)){
            xWarp = 80;
            yWarp = 80;
            if(dist < mouseRadius){
              x -= Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/xWarp));
              y -= Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/yWarp));
            } else {
              x += Math.cos(angle)*(dotRepelRadius/dist)*Math.abs(Math.sin(frame/xWarp));
              y += Math.sin(angle)*(dotRepelRadius/dist)*Math.abs(Math.cos(frame/yWarp));
            }
          } else if(frame < 2300+(i)){
            if(frame === 1865+(i)){
              vx = Math.cos(angle-Math.PI/2)*Math.random()*2;
              vy = Math.sin(angle-Math.PI/2)*Math.random()*2;
            }
            //if(dist < mouseRadius*0.25){
            //  vx -= Math.cos(angle)*(dotRepelRadius/dist);
            //  vy -= Math.sin(angle)*(dotRepelRadius/dist);
            //} else {
              vx += (Math.cos(angle)*(dotRepelRadius/dist**(1.8)))*0.01;
              vy += (Math.sin(angle)*(dotRepelRadius/dist**(1.8)))*0.01;
              if(dist < r+d.r){
                vx -= (Math.cos(angle)*(dotRepelRadius/dist**(1.8)))*0.1;
                vy -= (Math.sin(angle)*(dotRepelRadius/dist**(1.8)))*0.1;
                x -= Math.cos(angle)*(Math.abs(vx+vy)/2);
                y -= Math.sin(angle)*(Math.abs(vx+vy)/2);
                //vx *= 0.7;
                //vy *= 0.7;
                //d.vx = (d.vx+vx)/2;
              //  vx = d.vx;
              //  d.vy = (d.vy+vy)/2;
              //  vy = d.vy;
              //  vx -= (Math.cos(angle)*(dotRepelRadius/dist))/10;
              //  vy -= (Math.sin(angle)*(dotRepelRadius/dist))/10;
              //  vx *= 0.9;
              //  vy *= 0.9;
              }
              if(Math.abs(vx)+Math.abs(vy) > 11){
                vx *= 0.5;
                vy *= 0.5;
              }
           //}

         } else {
           vx = 0;
           vy = 0;
           //frame = 0;
           //console.log("frame just set to 0", frame);
           if(dist < mouseRadius){
             x -= Math.cos(angle)*(dotRepelRadius/dist);
             y -= Math.sin(angle)*(dotRepelRadius/dist);
           } else {
             x += Math.cos(angle)*(dotRepelRadius/dist)*4;
             y += Math.sin(angle)*(dotRepelRadius/dist)*4;
           }
           if(frame >= 2800+(i)){
             frameDots = 0;
             frame = 0;
           }
           //vx = 0;
           //vy = 0;
         }
        }
      });
      if(frame >= 1865){
        x += vx;
        y += vy;
      }
      //vx *= 0.99;
      //vy *= 0.99;
      xCount += x;
      yCount += y;
      return {x,y,vx,vy,r}
    });
    ox = xCount/this.dots.length-w/2;
    oy = yCount/this.dots.length-h/2;
  }
  drawDots = () => {
    const w = this.w;
    const h = this.h;
    const ctx = this.ctx;

    this.dots.forEach(({x,y,r}) => {
      ctx.moveTo(x+r-ox, y-oy);
      ctx.arc(x-ox, y-oy, r, 0, Math.PI*2);
    });
  }
  createCs = (n) => {
    const { w, h } = this;
    const cs = [];
    const dir = Math.random() > 0.5 ? 1 : -1;
    const ar = (Math.random()*1+1)*dir;
    const angle = Math.random()*Math.PI*2;
    for(let i = 0; i < n; i++){
      cs.push({
        x: Math.cos(angle)*((i/n)*w*2),
        y: Math.sin(angle)*((i/n)*h*2),
        z: (i/n)*64,
        vx: Math.cos(angle+Math.PI/2)*(i/n)*16,
        vy: Math.sin(angle+Math.PI/2)*(i/n)*16,
        vz: 0,
        r: Math.random()*10+2
      })
      // cs.push({
      //   x: Math.cos(i/n*Math.PI*2)*(i/n*w/2),
      //   y: Math.sin(i/n*Math.PI*2)*(i/n*h/2),
      //   z: Math.sin(i/n*Math.PI*2)*16,
      //   vx: Math.cos(i/n*Math.PI*2+Math.PI/2)*Math.PI/2,//Math.random()*6-3,
      //   vy: Math.sin(i/n*Math.PI*2+Math.PI/2)*Math.PI/2,//Math.random()*6-3,
      //   vz: 0,//(i/n)/3,//Math.random()*0.02-0.01,
      //   r: 10//Math.random()*10+2
      // })
      // cs.push({
      //   x: ((i/n*2)*w-w/2)*ar*Math.sin(i/n*2),//Math.random()*w-w/2,
      //   y: ((i/n*2)*h-h/2)*ar*Math.sin(i/n*2),//Math.random()*h-h/2,
      //   z: ((i/n*2)*h/4-h/8)*ar*Math.sin(i/n*2),//Math.random()*6+0.5,
      //   vx: (n-(i+1))/8,//Math.random()*6-3,
      //   vy: -(n-(i+1))/8,//Math.random()*6-3,
      //   vz: -(n-(i+1))/128,//(i/n)/3,//Math.random()*0.02-0.01,
      //   r: 10,//Math.random()*4+1
      // })
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
          if(d < (r+jr)){
            jvx *= 0.998;
            jvy *= 0.998;
            jvz *= 0.998;
            if(d < (r+jr)*0.5){
              jx -= xd/d;
              jy -= yd/d;
              jz -= zd/d;
            }
          } else {
            jvx += xd/d**2;
            jvy += yd/d**2;
            jvz += zd/d**2;///((this.w+this.height)/2);
          }

          const cj = {
            ...this.cs[j],
            x: jx,
            y: jy,
            z: jz,
            vx: jvx,
            vy: jvy,
            vz: jvz,
            r: jr,
            d
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
    avgPos.z = Math.max(avgPos.z, 10);
    this.o = avgPos;
    //console.log("avg:", this.o);
    this.zoom = this.getZoom();
  }
  draw = (frame) => {
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
    if(frame % 4000 >= 2000) {
      this.drawDots();
    } else {
      this.cs.forEach(({x,y,z,r}) => {
        z = z/zoom+zoom/((this.o.z**0.5)*4);//*((Math.cos(frame/20)+2));
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
    }
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
      //if(frame === 0){
        //ctx.fillStyle = 'rgba(255,255,255,1)';
        //ctx.fillRect(0,0,w,h);
        //this.zoom = 8;
        //ctx.putImageData(this.mapNoise(1, 10)[0], 0, 0);

    //  }
    if(frame%1000 < 380){
        ctx.globalCompositeOperation = 'source-in';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    this.postProcess(frame);
    // if(frame % 8 === 0){
    //   ctx.fillStyle='rgba(0,0,0,0.01)';
    //   ctx.fillRect(0,0,w,h);
    // }
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
         const dist = Math.max(0.1,(1-Math.sqrt((x-(w/2+(Math.cos(frame/50)*10)))**2+(y-(h/2+(Math.sin(frame/50)*10)))**2)/Math.min(w,h)*(3.5+Math.cos(frame/20)*0.5))*(32+(Math.cos(frame/30)*6)));
         const dist2 = (1-(Math.sqrt((x-(w/2))**2+(y-(h/2))**2)/((w+h)/(Math.sin(frame/40)*2+3))))*(((frame%1000)/(Math.sin(frame/500)*250+750)));
         const ax = x+Math.round(Math.cos(angle)*dist);
         const ay = y+Math.round(Math.sin(angle)*dist);
         const i = (x + y * w) * 4;
         const j = (ax + ay * w) * 4;
         //const val = valueB*dist*255 > 128? valueB : valueA;
        // const val = Math.sin(frame/16)+1;//valueA;
         imageData.data[i] -= (imageData.data[i]-this.noiseMap[frame%this.nMaps].data[i])/(this.nMaps*6)*dist2;
         imageData.data[i + 1] -= (imageData.data[i + 1]-this.noiseMap[frame%this.nMaps].data[i + 1])/(this.nMaps*6)*dist2;
         imageData.data[i + 2] -= (imageData.data[i + 2]-this.noiseMap[frame%this.nMaps].data[i + 2])/(this.nMaps*6)*dist2;
         imageData.data[i + 3] = 255;
         imageData.data[i] -= (imageData.data[i]-imageData.data[j])/(32+(Math.sin(frame/20)*6))*dist2;
         imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[j + 1])/(32+(Math.sin(frame/20)*6))*dist2;
         imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[j + 2])/(232+(Math.sin(frame/20)*6))*dist2;
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
             imageData.data[i] -= (imageData.data[i]-imageData.data[l])/9*dist2;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[l + 1])/9*dist2;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[l + 2])/9*dist2;
           }
           if(frame%4===1){
             imageData.data[i] -= (imageData.data[i]-imageData.data[d])/9*dist2;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[d + 1])/9*dist2;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[d + 2])/9*dist2;
           }
           //}
          // if(x > 0){
          if(frame%4===2){
             imageData.data[i] -= (imageData.data[i]-imageData.data[r])/9*dist2;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[r + 1])/9*dist2;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[r + 2])/9*dist2;
           }
        //  }
        //   if(y < h){

          // }
          // if(y > 0){
          if(frame%4===3){
             imageData.data[i] -= (imageData.data[i]-imageData.data[u])/9*dist2;
             imageData.data[i + 1] -= (imageData.data[i + 1]-imageData.data[u + 1])/9*dist2;
             imageData.data[i + 2] -= (imageData.data[i + 2]-imageData.data[u + 2])/9*dist2;
           }
          // }
         }
         if(frame % 1000 > 900 && frame % 1000 < 950){
           imageData.data[i] -= 2;
           imageData.data[i + 1] -= 2;
           imageData.data[i + 2] -= 2;
         } else if(frame % 1000 >= 950 && frame % 2 === 0){
           imageData.data[i] -= 1.5;
           imageData.data[i + 1] -= 1.5;
           imageData.data[i + 2] -= 1.5;
         }
       }
     }
     ctx.putImageData(imageData, 0, 0);
  }
  getZoom(){
    return Math.pow((this.w+this.h)/2, 0.5);
  }
  ms = [];
  loop(){
    //this.cs.push(this.createCs(1)[0]);
    //this.startCs++;
    if(this.allowLoop){
      this.t0 = performance.now();
      if(this.frame % 4000 >= 2000) this.updateDots();
      this.update(this.frame)
      //while(this.frame < 100){
        this.draw(this.frame);
        if(this.frame % 4000 >= 2000) frameDots++;
        this.frame ++;
    //  }
      this.t1 = performance.now();
      this.ms.push(this.t1-this.t0);
      if(this.ms.length > 4){
        this.ms.shift();
      }
      if(this.frame < 60 && this.ms.reduce((acc,val)=>acc+val)/this.ms.length > 100){
        //console.log("too slow");
        this.reset();
        this.resize(this.w*0.9, this.h*0.9);
        console.log("reset..");
      }
      if(this.frame === 4000){
        this.reset();
      }
      requestAnimationFrame(()=>this.loop());
    }
  }
  resize(w = 480,h = 480){
    this.w = Math.round(Math.max(w, 16));
    this.h = Math.round(Math.max(h, 16));
    mouseRadius = this.w*0.2;
    dotRepelRadius = this.w*0.075;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const size = Math.min(ww, wh);
    const left = ww/2-size/2;
    const top = wh/2-size/2;
    this.canvasElement.style.width = size+"px";
    this.canvasElement.style.height = size+"px";
    this.canvasElement.style.left = left+"px";
    this.canvasElement.style.top = top+"px";
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
    this.initDots();
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
