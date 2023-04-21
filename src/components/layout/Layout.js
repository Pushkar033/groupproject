import React from "react";
import { Fragment } from "react";
import MainNavigation from "./MainNavigation";
import { Container, Row, Col } from "react-bootstrap";
function Layout(props) {
  return (
    <Fragment>
      <MainNavigation />
      <Container>
        <Row  className="justify-content-center">
          <Col sm={8}>{props.children}</Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Layout;
