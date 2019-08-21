import React from 'react';
import msToHours from '../scripts/msToHours';

function timestampToString(timestamp) {
  const date = new Date(timestamp);
  return date.toDateString();
}

function timestampToTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

function intervalCost(interval, rate) {
  return (msToHours(interval.end-interval.start) * rate).toFixed(2);
}

function DayStamp(props) {
  const totalMs = props.intervals.reduce((acc, interval) => {
    return acc + (interval.end-interval.start);
  }, 0)

  const hours = msToHours(totalMs);
  let minutes = Math.floor(hours%60);
  if (minutes < 10) minutes = "0"+minutes

  return (
    <div>
      <h2>{props.day} | {Math.floor(hours)}:{minutes} - ${(hours * props.rate).toFixed(2)}</h2>
      {props.intervals.map(interval => {
        return (
          <div key={interval.start}>
            <h3>${intervalCost(interval, props.rate)}</h3>
            <h4>Description: {interval.note}</h4>
            <h4 key={interval.start}>{timestampToTime(interval.start)} - {timestampToTime(interval.end)}</h4>
          </div>
        );
      })}

    </div>
  )
}

export default class Reader extends React.Component {
  render() {
    const timesheet = {};
    const sortedIntervals = this.props.intervals.sort(interval => interval.start);
    sortedIntervals.forEach(interval => {
      const dateString = timestampToString(interval.start);
      if (timesheet[dateString] !== undefined) {
        timesheet[dateString].push(interval);
        return;
      }
      timesheet[dateString] = [interval];
    });

    const allDayStamps = Object.keys(timesheet).map((key, i) => <DayStamp rate={this.props.project.rate} day={key} intervals={timesheet[key]} key={key} />)
    return (
      <div>{allDayStamps}</div>
    )
  }
}
