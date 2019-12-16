import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import CommentItem from "./CommentItem";
import { CURRENTPOST, CURRENTCOMMENT, ADDNEWCOMMENT } from "../actions";
import { Link } from "react-router-dom";
import { vote } from "../action_creators";
import uuid from 'uuid/v1'

export class Post extends Component {
  componentDidMount() {
    const {
      match: {
        params: { postid }
      }
    } = this.props;
    this.props.getPostAndComments(postid);
  }

  state = { newCommentBody: "" }

  render() {
    const { curr_post, comments, vote } = this.props;

    return (
      <div>
        <Link to="/">
          <h4>Udaicty News</h4>
        </Link>
        <h4>post detail page </h4>
        <div>
          <button
            onClick={e => {
              vote("up", curr_post.id);
            }}
          >
            up
          </button>
          <span>{curr_post.voteScore}</span>
          <button
            onClick={e => {
              vote("down", curr_post.id);
            }}
          >
            down
          </button>
        </div>
        <h4>{curr_post.title}</h4>
        <Link to={{ pathname: "/edit", state: { curr_post: curr_post } }}>
          <button>Edit</button>
        </Link>
        <p>{curr_post.author}</p>
        <p>{curr_post.body}</p>
        <p> comments:{comments.length}</p>
        <div>
          {comments.map(comment => (
            <CommentItem comment={comment} />
          ))}
        </div>
        <div>
          <button onClick={e => this.setState({ newCommentBody: "" })}>clear</button>
          <textarea value={this.state.newCommentBody} onChange={e => { this.setState({ newCommentBody: e.target.value }) }} />
          <button onClick={e => {
            this.setState({ newCommentBody: "" });
            this.props.addNewComment({ id: uuid(), timestamp: Date.now(), body: this.state.newCommentBody, author: "Anonymous", parentId: curr_post.id }, () => { this.setState({ newCommentBody: "" }) })
          }}>add new comment</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  curr_post: state.curr_post,
  comments: state.comments
});

const getPostAndComments = postid => {
  return dispatch => {
    axios
      .get(`/posts/${postid}`, { headers: { Authorization: "Bearer" } })
      .then(resp => {
        dispatch({ type: CURRENTPOST, payload: resp.data });
      });
    axios
      .get(`/posts/${postid}/comments`, {
        headers: { Authorization: "Bearer" }
      })
      .then(resp => {
        dispatch({ type: CURRENTCOMMENT, payload: resp.data });
      });
  };
};


const addNewComment = (newCommentObj, cb) => {
  return dispatch => {
    axios.post("/comments", newCommentObj, { headers: { Authorization: "Bearer" } }).then(resp => {
      dispatch({ type: ADDNEWCOMMENT, payload: resp.data });
      cb();
    })
  }
}

const mapDispatchToProps = dispatch => ({
  getPostAndComments: postid => dispatch(getPostAndComments(postid)),
  vote: (upOrDown, id) => dispatch(vote(upOrDown, id)),
  addNewComment: (newCommentBody, cb) => dispatch(addNewComment(newCommentBody, cb))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);
