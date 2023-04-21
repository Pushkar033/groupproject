import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query ($retiringSoon:Boolean) {
    employees(retiringSoon:$retiringSoon) {
      id
      firstName
      lastName
      age
      title
      department
      doj
      dob
      currentStatus
      employeeType
    }
  }
`;

export const FILTER_EMPLOYEE = gql`
query ($searchInput: String,$retiringSoon:Boolean) {
  filterEmployees(searchInput: $searchInput,retiringSoon:$retiringSoon) {
    id
    firstName
    lastName
    age
    title
    department
    doj
    dob
    currentStatus
    employeeType
  }
}
`;

export const ADD_EMPLOYEE = gql`
  mutation addEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      firstName
      lastName
      age
      title
      department
      doj
      dob
      currentStatus
      employeeType
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee($input: EmployeeInput!) {
    updateEmployee(input: $input) {
      id
      firstName
      lastName
      age
      title
      department
      doj
      dob
      currentStatus
      employeeType
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;
