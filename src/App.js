import { Redirect, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AllEmployees from "./pages/AllEmployees";
import AddEmployee from "./pages/AddEmployee";
import NotFound from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/employees"></Redirect>
        </Route>
        <Route path="/employees" exact>
          <AllEmployees />
        </Route>
        <Route path="/edit-or-add-employee">
          <AddEmployee />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
