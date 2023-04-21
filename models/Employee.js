const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  doj: {
    type: Date,
    required: true,
  },
  dob:{
    type:Date,
    required:true
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("EMPLOYEE", UserSchema);
module.exports = Employee;
