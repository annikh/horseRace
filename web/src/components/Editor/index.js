import React, { Component } from "react";
import AceEditor from "react-ace";
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "brace/mode/python";
import "brace/theme/monokai";
import "./style.css";

class Editor extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleRunClick = this.handleRunClick.bind(this);

    this.state = {
      aceEditorValue: this.props.defaultCode
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultCode !== prevProps.defaultCode) {
      this.handleChange(this.props.defaultCode);
    }
  }

  handleChange(value) {
    this.setState({ aceEditorValue: value });
  }

  handleRunClick(event) {
    event.preventDefault();
    this.props.onRunCode(this.state.aceEditorValue);
  }

  render() {
    return (
      <>
        <Row>
          <AceEditor
            mode="python"
            theme="monokai"
            onChange={this.handleChange}
            width={"100%"}
            height={"50vh"}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            editorProps={{ $blockScrolling: true }}
            value={this.state.aceEditorValue}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </Row>
        <Row>
          <Button className="runButton" size="lg" onClick={this.handleRunClick}>
            <FontAwesomeIcon icon="play" />
            <span style={{ paddingLeft: "5px" }}>Run</span>
          </Button>
        </Row>
      </>
    );
  }
}

export default Editor;
