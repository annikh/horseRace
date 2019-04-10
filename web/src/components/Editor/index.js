import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleRunClick = this.handleRunClick.bind(this);
        this.handleGuessClick = this.handleGuessClick.bind(this);

        this.state = {
            aceEditorValue: '# Skriv inn koden din her.'
        }
    }

    handleChange(value) {
        this.setState({ aceEditorValue: value });
    }

    handleRunClick(event) {
        event.preventDefault();
        this.props.onRunCode(this.state.aceEditorValue)
    } 

    handleGuessClick(event) {
        event.preventDefault();
        this.props.onImageGuess();
    }

    render() {
        return(
            <div>
                <AceEditor
                    mode="python"
                    theme="monokai"
                    onChange={this.handleChange}
                    width={"80vh"}
                    height={"60vh"}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    editorProps={{$blockScrolling: true}}
                    value={this.state.aceEditorValue}
                    setOptions={{
                      showLineNumbers: true,
                      tabSize: 2,
                    }}/>
                <Row>
                <Col><Button variant="success" onClick={this.handleRunClick} ><FontAwesomeIcon icon="play"/> Run</Button></Col>
                <Col><Button variant="primary" onClick={this.handleGuessClick}>Gjett hva som er på bildet</Button></Col>
                </Row>
            </div>
        )
    }
}


export default Editor;
