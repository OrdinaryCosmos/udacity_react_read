import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { LOADCATEGORY, SORTPOST } from "../actions";
import { getCategories } from "../action_creators";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

class Header extends Component {
  componentDidMount() {
    this.props.getCategories();
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Udacity</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.props.categories.map(cate => (
              <Nav.Link><Link to={`/catergory/${cate}`}> {cate}</Link></Nav.Link>
            ))}
            <NavDropdown title="Sort By" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Button variant="primary" size="sm">
            New Post <Badge variant="light">+</Badge>
            <span className="sr-only">add new post</span>
          </Button>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories
});

const mapDispatchToProps = dispatch => ({
  getCategories: () => {
    dispatch(getCategories);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
