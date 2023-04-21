const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const Employee = require("./models/Employee");
const connectDB = require("./config/db.js");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Define a schema for our GraphQL API
const typeDefs = `#graphql
type Employee {
  id: ID!
  firstName: String!
  lastName: String!
  age: Int!
  title: String!
  department: String!
  doj: String!
  dob: String!
  currentStatus: String!
  employeeType: String!
}

type Query {
  employees(retiringSoon:Boolean): [Employee]
  filterEmployees(searchInput:String,retiringSoon:Boolean ): [Employee]
}

input EmployeeInput {
  id: String
  firstName: String!
  lastName: String!
  age: Int!
  title: String!
  department: String!
  doj: String!
  dob: String!
  currentStatus: String!
  employeeType: String!
}

type Mutation {
  addEmployee(input: EmployeeInput!): Employee
  updateEmployee(input: EmployeeInput!): Employee
  deleteEmployee(id: ID!): Employee
}
`;

// Define the resolvers for our GraphQL API
const resolvers = {
  Query: {
    employees: async (_, { retiringSoon }) => {
      const filterQuery = {
        dob: {
          $lte: new Date(new Date().getFullYear() - 65, new Date().getMonth(), new Date().getDate() + 180),
          $gte: new Date(new Date().getFullYear() - 65, new Date().getMonth(), new Date().getDate()),
        },
        currentStatus: "Working",
      };
      const employees = await Employee.find(retiringSoon ? filterQuery : null);
      return employees;
    },

    filterEmployees: async (_, { searchInput, retiringSoon }) => {
      const regularQuery = {
        $or: [
          { firstName: { $regex: searchInput } },
          { lastName: { $regex: searchInput } },
          { currentStatus: { $regex: searchInput } },
          { employeeType: { $regex: searchInput } },
          { department: { $regex: searchInput } },
        ],
      };

      const retiringSoonQuery = {
        $and: [
          {
            currentStatus: "Working",
            dob: {
              $lte: new Date(new Date().getFullYear() - 65, new Date().getMonth(), new Date().getDate() + 180),
              $gte: new Date(new Date().getFullYear() - 65, new Date().getMonth(), new Date().getDate()),
            },
          },
          {
            $or: [
              { firstName: { $regex: searchInput } },
              { lastName: { $regex: searchInput } },
              { currentStatus: { $regex: searchInput } },
              { employeeType: { $regex: searchInput } },
              { department: { $regex: searchInput } },
            ],
          },
        ],
      };

      const employees = await Employee.find(retiringSoon ? retiringSoonQuery : regularQuery);
      return employees;
    },
  },
  Mutation: {
    addEmployee: async (_, { input }) => {
      const employee = new Employee(input);
      await employee.save();
      return employee;
    },

    updateEmployee: async (_, { input }) => {
      const employee = await Employee.findByIdAndUpdate(input.id, input, { new: true });
      return employee;
    },

    deleteEmployee: async (_, { id }) => {
      const employee = await Employee.findByIdAndDelete(id);
      return employee;
    },
  },
};
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Red Alert ${err.stack}`);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, { listen: { port: 8080 } }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
