import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.onChange = this.onChange.bind(this);
        this.runCode = this.runCode.bind(this);

        this.state = {
            aceEditorValue: '# Enter your code here.',
            output: ''
        }
    }

    onChange(value) {
        this.setState({ aceEditorValue: value });
    }

    runCode(event) {
        event.preventDefault();

        axios.get('http://python-eval-server.appspot.com/run', { params: { code: this.state.aceEditorValue } })
        .then( response => {
          console.log(response)
          this.setState({output: response.data})
        })
        .catch(function(error) {
          console.log(error);
        });
    } 

    render() {
        return(
            <div>
            <h2>Editor</h2>
            <AceEditor
                placeholder="Placeholder Text"
                mode="python"
                theme="monokai"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.onChange}
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
                <Button bsStyle="primary" bsSize="small" onClick={this.runCode}>Run Code</Button>
                <br/><br/>

                <p>output: {this.state.output}</p>
            </div>
        )
    }
}


export default Editor;
