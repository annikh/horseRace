import React from "react";
import { Form } from "react-bootstrap";

const Console = (props) => {
  return (
    <Form.Control as="textarea" readOnly style={{backgroundColor: '#262722', color: '#aaaaaa', height: "20vh", width: "80vh"}} value={"Output: " + props.output}/>
  );
}

export default Console;
  