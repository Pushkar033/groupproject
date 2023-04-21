import { useMutation } from "@apollo/client";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE } from "../../graphql/queries";
import Card from "../UI/Card";
import { validateNumber, validateText } from "../validations/ValidateFormData";
import classes from "./EmployeeCreate.module.css";
import { Form, Button } from "react-bootstrap";
import FormSelect from "../UI/Select";
import FormInput from "../UI/Input";

import React from "react";

const formFields = [
  { name: "firstName", type: "text", label: "First name" },
  { name: "lastName", type: "text", label: "Last Name" },
  { name: "age", type: "number", props: { min: 1 }, label: "Age" },
  { name: "doj", type: "date", label: "Date of Joining" },
  { name: "dob", type: "date", label: "Date of birth" },
];

const selectFormFields = [
  {
    name: "title",
    options: ["Employee", "Manager", "Director", "VP"],
    inputLabel: "Title",
  },
  {
    name: "department",
    options: ["IT", "Marketing", "HR", "Engineering"],
    inputLabel: "Department",
  },
  {
    name: "employeeType",
    options: ["FullTime", "PartTime", "Contract", "Seasonal"],
    inputLabel: "Employee Type",
  },
  {
    name: "currentStatus",
    options: ["Working", "Retired"],
    inputLabel: "Current Status",
  },
];
const prohibitedTitles = ["Manager", "Director", "VP"];
const prohibitedEmployeeTypes = ["Contract", "Seasonal"];

const EditOrCreate = (props) => {
  const [mode, setMode] = useState("add");
  const [addEmployee] = useMutation(ADD_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const history = useHistory();
  const [form, setForm] = useState({
    id: null,
    firstName: "",
    lastName: "",
    age: "",
    doj: undefined,
    dob: undefined,
    title: "Employee",
    department: "IT",
    employeeType: "FullTime",
    currentStatus: "Working",
  });

  const {
    id,
    firstName,
    lastName,
    age,
    doj,
    dob,
    title,
    department,
    employeeType,
    currentStatus,
  } = form;

  function validateEmployeeData(employee) {
    const allowedTitles = ["Employee", "Manager", "Director", "VP"];
    const allowedDepartments = ["IT", "Marketing", "HR", "Engineering"];
    const allowedEmployeeTypes = [
      "FullTime",
      "PartTime",
      "Contract",
      "Seasonal",
    ];

    return (
      validateText(employee.firstName) &&
      validateText(employee.lastName) &&
      validateNumber(employee.age) &&
      validateText(employee.doj) &&
      validateText(employee.dob) &&
      allowedTitles.includes(employee.title) &&
      allowedDepartments.includes(employee.department) &&
      allowedEmployeeTypes.includes(employee.employeeType)
    );
  }
  function submitFormHandler(event) {
    event.preventDefault();

    const employee = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: +age,
      doj: new Date(doj).toDateString(),
      dob: new Date(dob).toDateString(),
      title: title.trim(),
      department: department.trim(),
      employeeType: employeeType.trim(),
      currentStatus: currentStatus,
    };
    //validate here
    if (!validateEmployeeData(employee)) {
      alert("Some entry might be missing or wrong value entered");
      return;
    }

    if (mode === "update") {
      employee.id = id;
    }

    const onComplete = () => {
      history.push("/employees");
    };

    const payload = { variables: { input: employee } };
    if (mode === "add") {
      addEmployee({ ...payload, onCompleted: onComplete });
    } else {
      updateEmployee({ ...payload, onCompleted: onComplete });
    }
  }

  useEffect(() => {
    const state = history.location.state;
    if (state?.data) {
      const {
        id,
        firstName,
        lastName,
        doj,
        dob,
        age,
        title,
        employeeType,
        department,
        currentStatus,
      } = state.data;
      console.log(state.data);
      setForm(() => ({
        id,
        firstName,
        lastName,
        age,
        doj: new Date(+doj).toISOString().substring(0, 10),
        dob: new Date(+dob).toISOString().substring(0, 10),
        title,
        department,
        employeeType,
        currentStatus,
      }));
      setMode("update");
    }
  }, [history.location.state]);

  const setEmployeeData = (evt) => {
    if (
      (prohibitedEmployeeTypes.includes(employeeType) &&
        prohibitedTitles.includes(evt.target.value)) ||
      (prohibitedTitles.includes(title) &&
        prohibitedEmployeeTypes.includes(evt.target.value))
    ) {
      alert("Contractor/Seasonal Employee Can't be a Manager/Director/VP");
    } else {
      setForm((prev) => ({ ...prev, [evt.target.id]: evt.target.value }));
    }
  };

  return (
    <Fragment>
      <Card>
        <Form onSubmit={submitFormHandler}>
          {formFields.map(({ type, name, label, props }) => {
            return (
              <FormInput
                key={name}
                controlId={name}
                inputLabel={label}
                inputType={type}
                value={form[name]}
                placeholder={"Enter " + name}
                onChange={setEmployeeData}
                {...props}
              />
            );
          })}
          {selectFormFields.map((props) => {
            return (
              <FormSelect
                value={form[props.name]}
                key={props.name}
                id={props.name}
                onChange={setEmployeeData}
                {...props}
              />
            );
          })}
          <div className={classes.actions}>
            <Button variant="primary" type="submit">
              {mode === "add" ? "Add " : "Update "} Employee
            </Button>
          </div>
        </Form>
      </Card>
    </Fragment>
  );
};

export default EditOrCreate;
