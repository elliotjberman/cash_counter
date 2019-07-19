import React from 'react';
import {getAllIntervals, saveInterval} from '../scripts/persistence.js';
import msToHours from '../scripts/msToHours';
import Reader from './Reader';

export default class Writer extends React.Component {
  constructor() {
    super();

    this.state = {
      interval: {start: null, end: null},
      project: {
        rate: 40,
        name: "ImagArena",
        totalHours: this.getTotalHours()
      },
      active: false,
      readerShowing: false
    };
    this.lastCashBlown = 0;
  }

  // componentDidMount() {
  //   this.syncSavedIntervals();
  // }

  getTotalHours() {
    const totalHours = getAllIntervals().reduce((acc, curr) => {
      return acc + msToHours(curr.end - curr.start)
    }, 0);
    return totalHours;
  }

  syncSavedIntervals() {
    this.setState(prevState => ({
        project: {
            ...prevState.project,
            totalHours: this.getTotalHours()
        }
    }));
  }

  toggleTimer() {
    if (!this.state.active) {
      this.startTimer();
      return;
    }

    saveInterval(this.state.interval);
    this.endTimer();
    this.syncSavedIntervals();
  }

  startTimer() {
    const now = Date.now();
    this.setState({
      active: true,
      interval: {start: now, end: now}
    });
    const audio = new Audio('audio/hitit.wav');
    audio.play();
  }

  endTimer() {
    this.setState({
      active: false,
      interval: {start: null, end: null}
    });
    const audio = new Audio('audio/stop.wav');
    audio.play();
  }

  updateCurrentTime() {
    this.setState(prevState => ({
        interval: {
            ...prevState.interval,
            end: Date.now()
        }
    }));
  }

  cashBlown(hours) {
    return this.state.project.rate * hours;
  }

  componentDidMount() {
    this.loop = setInterval(() => {
      if (this.state.active)
        this.updateCurrentTime();
    }, 1000);
  }

  compontWillUnmount() {
    if (this.state.active)
      saveInterval(this.state.interval);
  }

  render() {
    const currentTimeBlown = msToHours(this.state.interval.end - this.state.interval.start);

    // Jank
    const currentCashBlown = this.cashBlown(currentTimeBlown);
    if (Math.floor(currentCashBlown/10) > this.lastCashBlown) {
      const audio = new Audio('audio/nice.wav');
      audio.play();
      this.lastCashBlown = Math.floor(currentCashBlown/10);
    }

    let body;
    if (this.state.readerShowing) {
      body = <Reader project={this.state.project} intervals={getAllIntervals()} />
    }

    else {
      body = (
        <div>
          <h2>Current Run</h2>
          <h3>Rate: ${this.state.project.rate}</h3>
          <h3>Hours: {currentTimeBlown.toFixed(2)}</h3>
          <h3>Cash Blown: ${this.cashBlown(currentTimeBlown).toFixed(2)}</h3>

          <h2>Total</h2>
          <h3>Total Hours: {(currentTimeBlown + this.state.project.totalHours).toFixed(2)}</h3>
          <h3>Total Cash Blown: ${this.cashBlown(currentTimeBlown + this.state.project.totalHours).toFixed(2)}</h3>

          <button className={this.state.active ? "active" : ""} onClick={this.toggleTimer.bind(this)}>{this.state.active ? "Please, make it stop!" : "Hit it!"}</button>
        </div>
      )
    }

    return (
      <div>
        <button className="toggle" onClick={() => {this.setState({readerShowing: !this.state.readerShowing})}}>
          View {this.state.readerShowing ? "Realtime" : "History"}
        </button>
        <h1>{this.state.project.name} Project</h1>
        {body}
      </div>
    )
  }
}
