import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.handleChange = this.handleChange.bind(this);
        this.runCode = this.runCode.bind(this);
        this.handleErrorModalClose = this.handleErrorModalClose.bind(this);
        this.handleErrorModalShow = this.handleErrorModalShow.bind(this);
        this.handleSolvedModalClose = this.handleSolvedModalClose.bind(this);
        this.handleSolvedModalShow = this.handleSolvedModalShow.bind(this);

        this.state = {
            aceEditorValue: '# Enter your code here.',
            output: '',
            error_message: '',
            showErrorModal: false,
            showSolvedModal: false,
            errorModalHeaders: ['Prøv igjen!', 'Bedre lykke neste gang!', 'Dette gikk visst ikke helt etter planen.', 'Oops..', 'Ikke helt der ennå..'],
            errorModalHeaderText: '',
            currentTask: {difficulty: 1, test: "assert hei('Anniken') == 'Anniken', 'Returnerer funksjonen din navnet som skrives inn?'", text: "Lag en funksjon med navn 'hei' som tar inn et navn og returnerer det.", title: 'hei', error_hint: 'Har du husket å definere en funksjon som heter "hei"?'}
        }
    }

    handleChange(value) {
        this.setState({ aceEditorValue: value });
    }

    runCode(event) {
        event.preventDefault();
        console.log(this.state.aceEditorValue);
        // axios.get('http://python-eval-server.appspot.com/run', { params: { code: this.state.aceEditorValue } })
        axios.get('http://127.0.0.1:5000/run', { params: { code: this.state.aceEditorValue, task: this.state.currentTask } })
        .then( response => {
          console.log(response)
          this.setState({output: response.data.output, error_message: response.data.error_message})
          if (this.state.error_message !== '') this.handleErrorModalShow()
          if (response.data.solved) this.handleSolvedModalShow()
        })
        .catch(function(error) {
          console.log(error);
        });
    } 

    handleErrorModalClose() {
        this.setState({showErrorModal: false})
    }

    handleErrorModalShow() {
        this.setState({showErrorModal: true, errorModalHeaderText: this.state.errorModalHeaders[Math.floor(Math.random()*this.state.errorModalHeaders.length)]})
    }

    handleSolvedModalClose() {
        this.setState({showSolvedModal: false})
    }

    handleSolvedModalShow() {
        this.setState({showSolvedModal: true})
    }

    SolvedModal = () => (
        <Modal show={this.state.showSolvedModal} onHide={this.handleSolvedModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
                Bra jobbet!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Du fikk til oppgaven :D
          </Modal.Body>
        </Modal>
    )

    ErrorModal = () => (
        <Modal show={this.state.showErrorModal} onHide={this.handleErrorModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
                {this.state.errorModalHeaderText}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error_message}
          </Modal.Body>
        </Modal>
    )

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
                    value={this.state.aceEditorValue}
                    setOptions={{
                    showLineNumbers: true,
                    tabSize: 2,
                    }}/>
                <Button variant="success" onClick={this.runCode}><FontAwesomeIcon icon="play"/> Run</Button>
                <this.ErrorModal/>
                <this.SolvedModal/>
                <br/><br/>
                <Form.Control as="textarea" readOnly style={{backgroundColor: '#262722', color: '#aaaaaa', height: "20vh", width: "80vh"}} value={"Output: " + this.state.output}/>
            </div>
        )
    }
}


export default Editor;
