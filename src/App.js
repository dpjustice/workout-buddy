import React from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
  // var startTime
  // var endTime
  var myInterval = false
  // var setPromices
  var timeLeft

  function playSound(frequency = 261.6) {
    // console.log('play sound')
    // console.log(message)
    // endTime = new Date()
    // let totalTime = endTime - startTime
    // console.log(Math.round(totalTime/1000))

    var context = new AudioContext()
    var o = context.createOscillator()
    var g = context.createGain()
    o.connect(g)
    g.connect(context.destination)
    g.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + 1
    )
    o.frequency.value = frequency // 440.0
    o.start(0)
  }

  function countdown(ms) {
    let timer = document.getElementById("timer")
    timeLeft = Math.round(ms/1000)
    timer.innerHTML = String(timeLeft)

    // Clear out old countdown.
    if (myInterval !== false) {
      clearInterval(myInterval)
    }

    // Set new coutdown.
    myInterval = setInterval(() => {
      timeLeft -= 1
      if ( timeLeft >= 0 ) {
        timer.innerHTML = String(timeLeft)
      }
      if ( timeLeft <= 0 ) {
        clearInterval(myInterval)
      }
    }, 1000); // Run every second.

    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function runTimer(time, rest, setsLeft) {
    if (setsLeft > 0) {
      countdown(time*1000).then(() => playSound(261.6))
        .then(() => countdown(rest*1000)).then(() => playSound(261.6))
        .then(() => countdown(120)).then(() => playSound(261.6))
        .then(() => runTimer(time, rest, setsLeft - 1))
    } else {
      document.getElementById("button").disabled = false
    }
  }

  function handleClick(e) {
    e.preventDefault();
    // startTime = new Date()

    // Button.
    document.getElementById("button").disabled = true

    // Run calculations.
    let time = parseInt(document.getElementById("time").value)
    let rest = parseInt(document.getElementById("rest").value)
    let sets = parseInt(document.getElementById("sets").value)

    console.log(time)

    if ( isNaN(time) || isNaN(rest) || isNaN(sets) || time <= 0 || rest <= 0 || sets <= 0 ) {
      document.getElementById("button").disabled = false
      return
    }

    countdown(10000) // 10 seconds pass before starting.
      .then(() => playSound) // Start workout notification
      .then(() => runTimer(time, rest, sets))
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id="timer">Timer</div>
        <input id="time" class="inputNumber" type="number" min="0" step="1" required placeholder="Rep Time (sec)"></input>
        <input id="rest" class="inputNumber" type="number" min="0" step="1" required placeholder="Rest Time (sec)"></input>
        <input id="sets" class="inputNumber" type="number" min="0" step="1" required placeholder="How many Sets?"></input>
        <button id="button" onClick={handleClick}>Run Timer</button>
      </header>
    </div>
  );
}

export default App;
