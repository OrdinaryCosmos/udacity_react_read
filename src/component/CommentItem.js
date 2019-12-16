import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { vote, updateComment } from "../action_creators";

export class CommentItem extends Component {
  state = { showEdit: false };
  commentBody = createRef(this.props.comment.body);

  render() {
    const { comment } = this.props;
    console.log("props", this.props);

    return (
      <div>
        <button
          onClick={e => {
            vote("up", comment.id);
          }}
        >
          up
        </button>
        <span>{comment.voteScore}</span>
        <button
          onClick={e => {
            vote("down", comment.id);
          }}
        >
          down
        </button>
        <p>{comment.author}:</p>
        {this.state.changeComment ? (
          <div>
            <textarea ref={this.commentBody} defaultValue={comment.body} />
            <button
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
            </button>
          </div>
        ) : (
            <div>
              <p>{comment.body}</p>
              <button
                onClick={e => {
                  this.setState({ changeComment: true });
                }}
              >
                Edit
            </button>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  vote: (upOrDown, id) => dispatch(vote(upOrDown, id)),
  updateComment: (cb, comment) => {
    dispatch(updateComment(cb, comment));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItem);
