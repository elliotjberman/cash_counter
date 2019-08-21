import React from 'react';
import {getAllIntervals, saveInterval, savePayment, getAllPayments} from '../scripts/persistence.js';
import msToHours from '../scripts/msToHours';
import Reader from './Reader';
import prompt from 'electron-prompt';

function formatHours(hours) {
  let minutes = Math.floor(hours * 60 % 60);
  if (minutes < 10) minutes = "0"+minutes;
  return `${Math.floor(hours)}:${minutes}`;
}

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
      readerShowing: false,
      totalPaid: this.totalPaid()
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

    prompt({
        title: 'Enter description of services rendered',
        label: 'Notes:'
    })
    .then(result => {
      saveInterval({...this.state.interval, note: result});
      this.endTimer();
      this.syncSavedIntervals();
    })
    .catch(console.error);
  }

  savePayment() {
    prompt({
        title: 'How much?',
        label: 'Amount'
    })
    .then(amount => {
      savePayment({timestamp: Date.now(), amount: Number(amount)});
      this.setState({totalPaid: this.totalPaid()});
    })
    .catch(console.error);
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

  totalPaid() {
    const allPayments = getAllPayments();
    return allPayments.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0);
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
    // if (this.state.payShowing) {
    //   body = <Pay project={this.state.project} />
    // }

    else {
      body = (
        <div>
          <h2>Current Run</h2>
          <h3>Rate: ${this.state.project.rate}</h3>
          <h3>Time: {formatHours(currentTimeBlown)}</h3>
          <h3>Cash Blown: ${this.cashBlown(currentTimeBlown).toFixed(2)}</h3>

          <h2>Total</h2>
          <h3>Total Time: {formatHours(currentTimeBlown + this.state.project.totalHours)}</h3>
          <h3>Total Cash Blown: ${( this.cashBlown(currentTimeBlown + this.state.project.totalHours) - this.state.totalPaid ).toFixed(2)}</h3>

          <button className={this.state.active ? "active" : ""} onClick={this.toggleTimer.bind(this)}>{this.state.active ? "Please, make it stop!" : "Hit it!"}</button>
          <br />
          <br />
          <button onClick={this.savePayment.bind(this)}>Make a payment</button>
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
