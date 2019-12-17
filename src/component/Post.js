import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import CommentItem from "./CommentItem";
import { CURRENTPOST, CURRENTCOMMENT, ADDNEWCOMMENT } from "../actions";
import Header from "./Header";
import { Link } from "react-router-dom";
import { vote } from "../action_creators";
import uuid from 'uuid/v1'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import MdArrowDropupCircle from "react-ionicons/lib/MdArrowDropupCircle";
import MdArrowDropdownCircle from "react-ionicons/lib/MdArrowDropdownCircle";

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
    const { curr_post, vote } = this.props;
    const comments = this.props.comments.filter(comm => !comm.deleted)
    return (
      <Container>

        <Header></Header>
        <Row>
          <Col xs="2" md="1">
            <Row>
              <Col xs="12" style={{ textAlign: "center" }} >
                <MdArrowDropupCircle
                  color="green"
                  onClick={e => {
                    vote("up", curr_post.id);
                  }}
                />
              </Col>
              <Col xs="12" style={{ textAlign: "center" }} >{curr_post.voteScore}</Col>
              <Col xs="12" style={{ textAlign: "center" }} >
                <MdArrowDropdownCircle
                  color="red"
                  onClick={e => {
                    vote("down", curr_post.id);
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <h5>{curr_post.title}</h5>

            <p>by: {curr_post.author}</p>
          </Col>
          <Col>
            <Link to={{ pathname: "/edit", state: { curr_post: curr_post } }}>
              <Button variant="outline-info">Edit the post </Button>
            </Link>
          </Col>
        </Row>
        <Row style={{ margin: '10px', }} >
          <Col xs={12} style={{ backgroundColor: "#e6efff" }}><p>{curr_post.body}</p></Col>
          <Col xs={12}>
            <p> comments:{comments.length}</p>
            <div>
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </Col>
        </Row>



        <Row>
          <Col sm={{ span: 10, offset: 1 }} >
            <textarea style={{ width: "100%" }} value={this.state.newCommentBody} onChange={e => { this.setState({ newCommentBody: e.target.value }) }} />
            <Button block onClick={e => {
              this.setState({ newCommentBody: "" });
              this.props.addNewComment({ id: uuid(), timestamp: Date.now(), body: this.state.newCommentBody, author: "Anonymous", parentId: curr_post.id }, () => { this.setState({ newCommentBody: "" }) })
            }}>add new comment</Button>
          </Col>
        </Row>
      </Container>
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
