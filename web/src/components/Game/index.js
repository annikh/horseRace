import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';

const Game = () => {
    return (
        <Container className="accountBody">
            <Row>
                Her skal det være et spill
            </Row>
            <Row>
                <Button className="btn-orange">Start Spill!</Button>
            </Row>
        </Container>
    )
}

export default Game;