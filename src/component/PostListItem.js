import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { vote } from "../action_creators";

export class PostListItem extends Component {
  render() {
    const { post, vote } = this.props;

    return (
      <div>
        <button
          onClick={e => {
            vote("up", post.id);
          }}
        >
          up
        </button>
        <span>{post.voteScore}</span>
        <button
          onClick={e => {
            vote("down", post.id);
          }}
        >
          down
        </button>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
        <span>comments:{post.commentCount}</span>
        <Link to={{ pathname: "/edit", state: { curr_post: post } }}>
          <button> Edit</button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  vote: (upOrDown, id) => dispatch(vote(upOrDown, id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostListItem);
