import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import { getCategories } from "../action_creators";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

class Header extends Component {
  componentDidMount() {
    this.props.getCategories();
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Udacity News</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.props.categories.map(cate => (
              <NavLink key={cate} style={{ margin: "0 5px" }} activeClassName="active_link" to={`/${cate}`}> {cate}</NavLink>
            ))}
          </Nav>
          <Link to="/edit">
            <Button variant="primary" size="sm">
              New Post <Badge variant="light">+</Badge>
              <span className="sr-only">add new post</span>
            </Button>
          </Link>
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
