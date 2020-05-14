import React from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
  var workoutInterval = false

  function playSound(frequency = 261.6) {
    let context = new AudioContext()
    let o = context.createOscillator()
    let g = context.createGain()
    o.connect(g)
    g.connect(context.destination)
    g.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + 1
    )
    o.frequency.value = frequency // 440.0
    o.start(0)
  }

  function startTimer(workoutTime, restTime, sets) {
    // Clear out old countdown to ensure no duplication.
    if (workoutInterval !== false) {
      clearInterval(workoutInterval)
    }

    // Add alarm times to arrays.
    let timer = document.getElementById("timer")
    let background = document.querySelector(".App-header")
    let restAlarms = [0]
    let workoutAlarms = []
    let totalTime = 0
    let timeLeft = restTime
    let currentTime = 0
    for (let set = 0; set < sets; set++) {
      workoutAlarms.push(totalTime + restTime)
      restAlarms.push(totalTime + restTime + workoutTime)
      totalTime += restTime + workoutTime
    }
    // console.log(workoutAlarms)
    // console.log(restAlarms)

    function updateTimer() {
      // console.log('-------')
      // console.log(currentTime)
      // console.log(timeLeft)

      // Workout actions.
      if (workoutAlarms.includes(currentTime)) {
        // console.log('WORKOUT SOUND')
        playSound()
        timeLeft = workoutTime
        background.style.background = '#4169E1'
      }

      // Rest actions.
      if (restAlarms.includes(currentTime)) {
        // console.log('REST SOUND')
        playSound()
        timeLeft = restTime
        background.style.background = '#666600'
      }

      // Display time left.
      timer.innerHTML = String(timeLeft)

      // Update times for next check.
      currentTime += 1
      timeLeft -= 1

      // Clear interval if needed.
      if (currentTime > totalTime || timeLeft < 0) {
        clearInterval(workoutInterval)
        timer.innerHTML = "Workout Complete"
        background.style.background = '#228B22'
        document.getElementById("button").disabled = false
      }
    }

    // Set new coutdown.
    updateTimer() // Hack to run timer at the first second.
    workoutInterval = setInterval(updateTimer, 1000); // Run every second.
  }

  function handleClick(e) {
    e.preventDefault();

    // startTimer(5, 3, 3)
    // return

    // Button.
    document.getElementById("button").disabled = true

    // Run calculations.
    let time = parseInt(document.getElementById("time").value)
    let rest = parseInt(document.getElementById("rest").value)
    let sets = parseInt(document.getElementById("sets").value)

    // console.log(time)

    if ( isNaN(time) || isNaN(rest) || isNaN(sets) || time <= 0 || rest <= 0 || sets <= 0 ) {
      document.getElementById("button").disabled = false
      return
    }

    startTimer(time, rest, sets)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id="timer">Timer</div>
        <input id="time" className="inputNumber" type="number" min="0" step="1" required placeholder="Rep Time (sec)"></input>
        <input id="rest" className="inputNumber" type="number" min="0" step="1" required placeholder="Rest Time (sec)"></input>
        <input id="sets" className="inputNumber" type="number" min="0" step="1" required placeholder="How many Sets?"></input>
        <button id="button" onClick={handleClick}>Run Timer</button>
      </header>
    </div>
  );
}

export default App;
