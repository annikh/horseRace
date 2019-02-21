import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './App.css';

const App = () => {
  return (
    <div className='App-menu'>
    <Container>
      <Row className='App-text'>
        <Col></Col>
        <Col><h1>La oss kode!</h1></Col>
        <Col></Col>
      </Row>
      
      <Row className='App-buttons'>
        <Col></Col>
        <Col>
          <Link to="/student"><Button variant="outline-light" size="lg" block>Jeg er en elev!</Button></Link>
        </Col>
        <Col>
        <Link to="/teacher"><Button variant="outline-light" size="lg" block>Jeg er en lærer!</Button></Link>
        </Col>
        <Col></Col>
      </Row>  
    </Container>
    </div>

  )
}

export default App;