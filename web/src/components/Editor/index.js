import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Button } from 'react-bootstrap';

import 'brace/mode/python';
import 'brace/theme/monokai';

class Editor extends Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.onChange = this.onChange.bind(this);
    }
    
    onChange(newValue) {
      console.log('change', newValue);
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
                value={'print "Hello World" '}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                }}/>
                <Button bsStyle="primary" bsSize="small">Run Code</Button>
            </div>
        )
    }
}


export default Editor;
