import React, { Component } from 'react';
import './App.css';
let ctx;
let subA = 8454;
let subB = 8449;
let diff = subA-subB;
let padding = 50;
let barHeight = 40;
let barWidth;
let multiplier = 0.06;
function commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
class App extends Component {
  resize(){
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvasElement.width = this.w;
    this.canvasElement.height = this.h;
  }
  update(){
    diff = subA-subB;
    barWidth = Math.sqrt(diff)*Math.sqrt(this.w)*multiplier;
  }
  draw(){
    //ctx.beginPath();
    //  ctx.moveTo(0, 0);
    //  ctx.lineTo(this.w, this.h);
    //  ctx.lineWidth = 2;
    //  ctx.strokeStyle = 'black';
    //  ctx.stroke();
    ctx.font = '28px Arial';
    if(this.w < 700){
      ctx.font = `${this.w/700*28}px Arial`;
    }
    ctx.clearRect(0,0,this.w,this.h);
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillText("PewDiePie Subscribers: "+commafy(subA), 100, 100);
      ctx.fillText("T-Series Subscribers: "+commafy(subB), 100, 200);
      ctx.fillText("Subscriber difference: "+commafy(subA-subB), 100, 300);
      ctx.fillStyle = 'rgb(255,100,100)';
      ctx.fillRect(this.w/2, this.h/2-barHeight/2-padding*1.5, barWidth, barHeight);
    //  ctx.closePath();

  }
  componentDidMount(){
    this.resize();
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    this.ctx = this.canvasElement.getContext('2d');
    ctx = this.ctx;

    setInterval(()=>{
      //fetch sub counts and draw

      Promise.all([
        fetch(`https://www.googleapis.com/youtube/v3/channels?forUsername=PewDiePie&part=statistics&key=AIzaSyBN5hQzXJQxkQUW_DZWDB97gEq6LTQPYi4`),
        fetch(`https://www.googleapis.com/youtube/v3/channels?id=UCq-Fj5jknLsUf-MWSy4_brA&part=statistics&key=AIzaSyBN5hQzXJQxkQUW_DZWDB97gEq6LTQPYi4`)
      ])
      .then(([a, b]) => {
        return Promise.all([a.json(), b.json()]);
      })
      .then(([a, b]) => {
        console.log("b:", b);
        subA = a.items[0].statistics.subscriberCount;
        subB = b.items[0].statistics.subscriberCount;
        this.update();
        this.draw();
      })
    }, 1000);

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
