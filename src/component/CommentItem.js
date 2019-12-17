import React, { Component, createRef } from "react";
import { connect } from "react-redux";

import { voteComment, updateComment, deleteComment } from "../action_creators";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import MdArrowDropdownCircle from 'react-ionicons/lib/MdArrowDropdownCircle'
import MdArrowDropupCircle from 'react-ionicons/lib/MdArrowDropupCircle'

export class CommentItem extends Component {
  state = { changeComment: false };
  commentBody = createRef(this.props.comment.body);


  render() {
    const { comment, voteComment } = this.props;

    return (
      <Row style={{ borderBottomWidth: "1px", borderColor: "grey", borderBottomStyle: "solid", padding: "5px" }}>
        <Col xs="2" md="1">
          <Row>
            <Col xs="12" style={{ textAlign: "center" }} >
              <MdArrowDropupCircle
                color="green"
                onClick={e => {
                  voteComment("up", comment.id);
                }}
              />
            </Col>
            <Col xs="12" style={{ textAlign: "center" }} >{comment.voteScore}</Col>
            <Col xs="12" style={{ textAlign: "center" }} >
              <MdArrowDropdownCircle
                color="red"
                onClick={e => {
                  voteComment("down", comment.id);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col sm="2"><span style={{ fontStyle: "oblique" }}>{comment.author}:</span></Col>
        {this.state.changeComment ? (
          <Col sm="5">
            <textarea ref={this.commentBody} defaultValue={comment.body} style={{ width: "100%" }} />
            <Button variant="success" size="sm" block
              onClick={e => {
                this.props.updateComment(
                  () => this.setState({ changeComment: false }),
                  {
                    body: this.commentBody.current.value,
                    timestamp: Date.now(),
                    id: comment.id
                  }
                );
              }}
            >
              Submit
            </Button>
          </Col>
        ) : (
            <Col sm="8">
              <span>{comment.body}</span>
              <Button size={"sm"} variant="outline-secondary" style={{ marginLeft: "10px" }}
                onClick={e => {
                  this.setState({ changeComment: true });
                }}
              >
                Edit the comment
            </Button>
              <Button size={"sm"} variant="outline-danger" style={{ marginLeft: "10px" }}
                onClick={e => this.props.deleteComment(comment.id)}
              >
                Delete the comment
            </Button>
            </Col>
          )}
      </Row>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  voteComment: (upOrDown, id) => dispatch(voteComment(upOrDown, id)),
  updateComment: (cb, comment) => {
    dispatch(updateComment(cb, comment));
  },
  deleteComment: (commentid) => {
    dispatch(deleteComment(commentid))
  }

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItem);
