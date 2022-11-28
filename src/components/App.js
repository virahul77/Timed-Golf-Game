import React, { Component, useState } from "react";
import "../styles/App.css";
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      time: 0, x: 45, y: 45,
      start: false,
      win : false,
      loose: false,
      winCount: 0,
      lostCount:0,
      tx: 501 + 3*Math.trunc(Math.random()*30),
      ty: 222 + 3*Math.trunc(Math.random()*30),
    };
    this.timer = null;
    this.hightScore = Number(localStorage.getItem('golfHighScore')) || 0;
  }
  componentDidMount() {
    window.onkeydown = (e) => {
      if(this.state.win || this.state.loose) return;
      if (this.state.x === 250 && this.state.y === 250) {
        return;
      }
      if (e.key === "ArrowUp") {
        this.setState({ y: this.state.y - 3 });
      }
      if (e.key === "ArrowDown") {
        this.setState({ y: this.state.y + 3 });
      }
      if (e.key === "ArrowLeft") {
        this.setState({ x: this.state.x - 3 });
      }
      if (e.key === "ArrowRight") {
        this.setState({ x: this.state.x + 3 });
      }
    };
  }
  startHandler() {
    this.setState({
      start: true,
    });
    this.timer = setInterval(() => {
      let move = Math.random();
      let moveRight = Math.random();
      let moveNum = 3*Math.trunc(move*11);
      if(moveRight > 0.5){
        this.setState({
          time: this.state.time + 1,
          tx: this.state.tx + (move>0.5?moveNum:-moveNum), 
        })
      }
      else {
        this.setState({
          time: this.state.time + 1,
          ty: this.state.ty + (move>0.5?moveNum:-moveNum), 
        })
      }
    }, 1000);
  }
  componentDidUpdate() {
    if(this.state.time > 40 && !this.state.loose){
      clearInterval(this.timer);
      this.setState({loose:true,win:false,lostCount:this.state.lostCount+1});
    }
    if(this.state.x === this.state.tx && this.state.y === this.state.ty){
      console.log('you win');
      clearInterval(this.timer);
      if(this.hightScore < 60-this.state.time) {
        this.hightScore = 60-this.state.time;
        localStorage.setItem('golfHighScore',this.hightScore)
      }
      if(!this.state.win){
        this.setState({win:true,winCount:this.state.winCount+1});
      }
    }
  }

  restart(){
    this.setState({ 
      time: 0, x: 45, y: 45,
      start: true,
      win : false,
      loose:false,
      tx: 501 + 3*Math.trunc(Math.random()*30),
      ty: 402 + 3*Math.trunc(Math.random()*30),
    });
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      let move = Math.random();
      let moveRight = Math.random();
      let moveNum = 3*Math.trunc(move*11);
      if(moveRight > 0.5){
        this.setState({
          time: this.state.time + 1,
          tx: this.state.tx + (move>0.5?moveNum:-moveNum), 
        })
      }
      else {
        this.setState({
          time: this.state.time + 1,
          ty: this.state.ty + (move>0.5?moveNum:-moveNum), 
        })
      }
    }, 1000);
  }

  render() {
    const pos = {
      left: this.state.x,
      top: this.state.y,
    };
    const targetPos = {
      left: this.state.tx,
      top: this.state.ty,
    }
    return (
      <>
        {!this.state.start && (
          <StartPage onClick = {this.startHandler.bind(this)}/>
        )}
        {this.state.start  && (
          <>
            <div className="ball" style={pos}></div>
            <div className="hole" style={targetPos}></div>
            {!this.state.win && !this.state.loose && <div className="heading-timer">Time : {this.state.time}</div>}
            {<SideStatus time={this.state.time} winCount={this.state.winCount} lostCount={this.state.lostCount} hightScore={this.hightScore} />}
          </>
        )}
        {this.state.win && <WinPage score={60-this.state.time} hightScore = {this.hightScore} restart={this.restart.bind(this)}/> }
        {this.state.loose && <LosePage restart={this.restart.bind(this)}/>}
      </>
    );
  }
}

const StartPage = ({onClick})=>{
  return (
    <div id="startPage">
      <div id="rules">
        <p>Welcome To Timed Golf Game </p>
        <p>In this Game you have a ball and a target. Your job is Put the ball inside target hole</p> 
        <p>Untill then a timer will be running.Target is also moving.</p>
        <p>Upon successfull putting ball to target timer will stop and your High-Score will update</p>
        <p>Timit Limit for win is 40s</p>
      </div>
      <button className="start btn" onClick={onClick}>
        Start Game
      </button>
    </div>
  )
}

const WinPage = ({score,hightScore,restart})=>{
  return (
    <div className="winPage">
      <p>Congratulations ! You Won 💥💥</p>
      <p>Current Score : {score}</p>
      <p>High Score : {hightScore}</p>
      <button onClick={restart} className='btn'>Restart Game</button>
    </div>    
  )
}

const LosePage = ({restart}) => {
  return <div className="winPage loose">
    <p>Oops You Lost 😞😞</p>
    <p>You din,nt reach within time</p>
    <button className="btn" onClick={restart}>Restart</button>
  </div>
}
const SideStatus = ({time,hightScore,winCount,lostCount})=> {
  return <div className="sideStatus">
    <h4>Current Score : {60-time}</h4>
    <h4>High Score : {hightScore}</h4>
    <h5>Wins : {winCount}</h5>
    <h5>Lost : {lostCount}</h5>
  </div>
}

export default Timer;
