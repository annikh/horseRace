import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.handleChange = this.handleChange.bind(this);
        this.runCode = this.runCode.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);

        this.state = {
            aceEditorValue: '# Enter your code here.',
            output: '',
            error_message: '',
            showModal: false,
            modalHeaders: ['Prøv igjen!', 'Bedre lykke neste gang!', 'Dette gikk visst ikke helt etter planen.', 'Oops..', 'Ikke helt der ennå..'],
            modalHeaderText: ''
        }
    }

    handleChange(value) {
        this.setState({ aceEditorValue: value });
    }

    runCode(event) {
        event.preventDefault();

        // axios.get('http://python-eval-server.appspot.com/run', { params: { code: this.state.aceEditorValue } })
        axios.get('http://127.0.0.1:5000/hei', { params: { code: this.state.aceEditorValue } })
        .then( response => {
          console.log(response)
          this.setState({output: response.data.output, error_message: response.data.error_message})
          if (this.state.error_message) this.handleModalShow()
        })
        .catch(function(error) {
          console.log(error);
        });
    } 

    handleModalClose() {
        this.setState({showModal: false})
    }

    handleModalShow() {
        this.setState({showModal: true, modalHeaderText: this.state.modalHeaders[Math.floor(Math.random()*this.state.modalHeaders.length)]})
    }

    ErrorModal = () => (
        <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
                {this.state.modalHeaderText}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error_message}
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
    )

    render() {
        return(
            <div>
            <this.ErrorModal/>
            <AceEditor
                placeholder="Placeholder Text"
                mode="python"
                theme="monokai"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.hanldeChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.aceEditorValue}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                }}/>
                <Button variant="success" onClick={this.runCode}>Run Code</Button>
                <br/><br/>
                <Form.Control as="textarea" style={{backgroundColor: '#262722', color: '#aaaaaa', height: 100, width: 500}} value={"Output: " + this.state.output}/>
            </div>
        )
    }
}


export default Editor;
