import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './../App.css';

const App = () => {
  return (
      <div className="app">
        <h1>Let's play a horse race!</h1>
        <Link to="/student"><button>I am a student!</button></Link>
        <Link to="/teacher"><button>I am a teacher!</button></Link>
      </div>
  )
}

export default App;