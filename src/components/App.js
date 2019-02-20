import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const App = () => {
  return (
      <div className="app">
        <h1>La oss kode!</h1>
        <Link to="/student"><Button variant="info" size="lg">Jeg er en elev!</Button></Link>
        <Link to="/teacher"><Button variant="info" size="lg">Jeg er en lærer!</Button></Link>
      </div>
  )
}

export default App;