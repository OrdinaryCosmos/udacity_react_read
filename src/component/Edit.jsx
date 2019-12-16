import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import uuid from "uuid/v1";
import { Link } from "react-router-dom";
import { getCategories } from "../action_creators";
export class Edit extends Component {
  componentDidMount() {
    console.log(this.props.categories);

    if (this.props.categories.length === 0) {
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

  selectRef = createRef("");

  render() {
    const { curr_post } = this.state;
    return (
      <div>
        <Link to="/">
          <h4>Udaicty News</h4>
        </Link>

        <form onSubmit={this.handleSubmit}>
          <label htmlFor="title">Title</label>
          {curr_post.id && (
            <button onClick={this.deletePost}>delete the post</button>
          )}
          <input
            type="text"
            name="title"
            value={curr_post.title}
            onChange={this.titleChange}
          />
          {curr_post.category || (
            <div>
              <label htmlFor="category">Category</label>
              <select name="catergory" ref={this.selectRef}>
                {this.props.categories.map(categ => (
                  <option value={categ}>{categ}</option>
                ))}
              </select>
            </div>
          )}
          <label htmlFor="post-body">Body:</label>
          <textarea
            name="post-body"
            value={curr_post.body}
            onChange={this.bodyChange}
          />
          ><button>submit the post</button>
        </form>
      </div>
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
