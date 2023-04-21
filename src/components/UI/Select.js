import { Form } from "react-bootstrap";

const FormSelect = ({ options,inputLabel,...rest }) => {
  return (
    <Form.Group>
      <Form.Label>{inputLabel}</Form.Label>
      <Form.Select className="mb-3" {...rest}>
        {options.map((option) => {
          return <option value={option} >{option}</option>;
        })}
      </Form.Select>
    </Form.Group>
  );
};

export default FormSelect;
