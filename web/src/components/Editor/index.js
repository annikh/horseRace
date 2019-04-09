import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.state = {
            aceEditorValue: '# Enter your code here.'
        }
    }

    handleChange(value) {
        this.setState({ aceEditorValue: value });
    }

    handleButtonClick(event) {
        event.preventDefault();
        this.props.onRunCode(this.state.aceEditorValue)
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
                <Button variant="success" onClick={this.handleButtonClick} ><FontAwesomeIcon icon="play"/> Run</Button>
            </div>
        )
    }
}


export default Editor;
