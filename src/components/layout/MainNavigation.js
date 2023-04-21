import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}> Employee Management System</div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink to="/employees" activeClassName={classes.active}>
              All Employees
            </NavLink>
          </li>
          <li>
            <NavLink to="/edit-or-add-employee" activeClassName={classes.active}>
              Add a Employee
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
