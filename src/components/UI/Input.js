import { Form } from "react-bootstrap";

const FormInput = ({ groupClass, inputType, inputLabel, controlId, placeholder, ...rest }) => {
  return (
    <Form.Group className={`mb-3 ${groupClass || ""}`} controlId={controlId || "basicText"}>
      <Form.Label>{inputLabel}</Form.Label>
      <Form.Control  id={controlId} type={inputType || "text"} placeholder={placeholder} {...rest} />
    </Form.Group>
  );
};

export default FormInput;
