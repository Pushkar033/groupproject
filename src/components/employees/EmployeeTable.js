import { Fragment, useEffect, useState } from "react";
import IconButton from "../UI/IconButton";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  GET_EMPLOYEES,
  DELETE_EMPLOYEE,
  FILTER_EMPLOYEE,
} from "../../graphql/queries";
import classes from "./EmployeeTable.module.css";
import React from "react";

import { InputGroup, Form, Table, Row, Col } from "react-bootstrap";
import SearchIcon from "../../assets/icons/search.svg";
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

const EmployeeTable = () => {
  const history = useHistory();
  const [retiringSoon, setRetiringSoon] = useState(false);
  const { loading, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { retiringSoon: retiringSoon },
  });
  const [employeeData, setEmployeeData] = useState(data);
  const [filterEmployees] = useLazyQuery(FILTER_EMPLOYEE);
  const [searchValue, setSearchValue] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [
      { query: GET_EMPLOYEES }, // DocumentNode object parsed with gql
      "employees", // Query name
    ],
    onCompleted: () => {
      setDataFetched(true);
      setSearchValue("");
      refetch();
    },
  });

  const onDeleteEmployee = (employeeId, currentStatus) => {
    if (currentStatus === "Working") {
      alert("CAN'T DELETE EMPLOYEE - STATUS ACTIVE");
    } else {
      deleteEmployee({ variables: { id: employeeId } });
    }
  };

  const searchEmployee = (evt) => {
    setSearchValue(evt.target.value);

    debounce(() => {
      filterEmployees({
        variables: {
          searchInput: evt.target.value,
          retiringSoon: retiringSoon,
        },
      }).then((rsp) => {
        setEmployeeData({ employees: rsp.data.filterEmployees });
      });
    }, 1000)();
  };

  useEffect(() => {
    refetch();
  }, [refetch, retiringSoon]);

  useEffect(() => {
    setEmployeeData(data);
  }, [data]);

  console.log(employeeData);

  return (
    <Fragment>
      <div>
        <h1>Employee Data</h1>
        <Row>
          <Col xs={4}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <img height={20} width={20} src={SearchIcon} alt="search" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                className="w-75"
                placeholder="Search"
                value={searchValue}
                aria-label="Search"
                onChange={searchEmployee}
              />
            </InputGroup>
          </Col>
          <Col xs={4}>
            <Form.Check
              checked={retiringSoon}
              onChange={(evt) => {
                setRetiringSoon(evt.target.checked);
              }}
              type="checkbox"
              label="Retiring in next 6 months"
            />
          </Col>
        </Row>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date of Joining</th>
              <th>Title</th>
              <th>Department</th>
              <th>Employee Type</th>
              <th>Current status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={classes.message} colSpan={12}>
                  data is loading...
                </td>
              </tr>
            ) : (
              employeeData?.employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.age}</td>
                  <td>
                    {new Date(+employee.doj).toISOString().substring(0, 10)}
                  </td>
                  <td>{employee.title}</td>
                  <td>{employee.department}</td>
                  <td>{employee.employeeType}</td>
                  <td>{employee.currentStatus}</td>
                  <td>
                    <div className={classes.iconContainer}>
                      <IconButton
                        icon="edit"
                        onClick={() => {
                          history.push("edit-or-add-employee", {
                            data: employee,
                          });
                        }}
                      />
                      <IconButton
                        icon="delete"
                        onClick={() =>
                          onDeleteEmployee(employee.id, employee.currentStatus)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!loading && dataFetched && (
              <tr>
                <td className={classes.message} colSpan={12}>
                  {(!employeeData?.employees ||
                    !employeeData?.employees.length) &&
                    "No data found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
};

export default EmployeeTable;
