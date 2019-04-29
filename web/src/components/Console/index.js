import React from "react";
import { Form, Row } from "react-bootstrap";
import "./style.css";

const Console = props => {
  return (
    <Row>
      <Form.Control
        as="textarea"
        readOnly
        className="console"
        value={"Output: " + props.output}
      />
    </Row>
  );
};

export default Console;
