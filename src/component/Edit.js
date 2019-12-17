import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import uuid from "uuid/v1";
import { Link } from "react-router-dom";
import { getCategories } from "../action_creators";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
export class Edit extends Component {
  componentDidMount() {
    console.log(this.props.categories);
    if (this.props.categories.length === 0) {// if this is the first page user lands on, the catergories have not been loaded yet.
      console.log("edit_component_did_mount");
      this.props.getCategories();
    }
  }

  state = {
    curr_post: this.props.location.state
      ? this.props.location.state.curr_post
      : { title: "", category: null, body: "" }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (typeof this.state.curr_post.id === "undefined") {
      const newpost = {
        ...this.state.curr_post,
        id: uuid(),
        timestamp: Date.now(),
        author: "newuser",
        category: this.selectRef.current.value
      };
      axios
        .post(
          "/posts",
          { ...newpost },
          { headers: { Authorization: "Bearer" } }
        )
        .then(resp => {
          console.log("add new post result", resp);
          this.props.history.push("/");
        });
    } else {
      axios
        .put(
          `/posts/${this.state.curr_post.id}`,
          {
            title: this.state.curr_post.title,
            body: this.state.curr_post.body
          },
          { headers: { Authorization: "Bearer" } }
        )
        .then(resp => {
          this.props.history.push("/");
        });
    }
  };

  deletePost = e => {
    const { curr_post } = this.props.location.state;
    e.preventDefault();
    axios
      .delete(`/posts/${curr_post.id}`, {
        headers: { Authorization: "Bearer" }
      })
      .then(resp => {
        this.props.history.push("/");
      });
  };

  titleChange = e => {
    let newtitle = e.target.value;
    this.setState(prevS => ({
      curr_post: { ...prevS.curr_post, title: newtitle }
    }));
  };

  bodyChange = e => {
    let newbody = e.target.value;
    this.setState(prevS => ({
      curr_post: { ...prevS.curr_post, body: newbody }
    }));
  };

  selectRef = createRef("");// according to the rubric, we are not supposed to change the category of each post, so there is no need to set it as a controlled input. ref will do the trick

  render() {
    const { curr_post } = this.state;
    return (
      <Container>

        <Row>
          <Link to="/">
            <h4>Udaicty News</h4>
          </Link>
        </Row>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="title">Title:</Form.Label>
            {curr_post.id && (
              <button onClick={this.deletePost}>delete the post</button>
            )}
            <Form.Control
              type="text"
              name="title"
              value={curr_post.title}
              onChange={this.titleChange}
            />
          </Form.Group>
          {curr_post.category || (
            <Form.Group>
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Control as="select" name="catergory" ref={this.selectRef}>
                {this.props.categories.map(categ => (
                  <option value={categ}>{categ}</option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label htmlFor="post-body">Body:</Form.Label>
            <Form.Control as="textarea"
              name="post-body"
              value={curr_post.body}
              onChange={this.bodyChange}
            />
          </Form.Group>
          <Button>submit the post</Button>
        </Form>
      </Container>
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
)(Edit);
