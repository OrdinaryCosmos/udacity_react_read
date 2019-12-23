import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { vote } from "../action_creators";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MdArrowDropdownCircle from 'react-ionicons/lib/MdArrowDropdownCircle'
import MdArrowDropupCircle from 'react-ionicons/lib/MdArrowDropupCircle'

export class PostListItem extends Component {
  render() {
    const { post, vote } = this.props;

    return (
      <Row style={{ borderBottomWidth: "1px", borderColor: "grey", borderBottomStyle: "solid", padding: "5px" }}>
        <Col xs={{ span: 2, offset: 2 }} md="1" >
          <Row>
            <Col xs="12" style={{ textAlign: "center" }} >
              <MdArrowDropupCircle
                color="green"
                onClick={e => {
                  vote("up", post.id);
                }}
              />
            </Col>
            <Col xs="12" style={{ textAlign: "center" }} >{post.voteScore}</Col>
            <Col xs="12" style={{ textAlign: "center" }} >
              <MdArrowDropdownCircle
                color="red"
                onClick={e => {
                  vote("down", post.id);
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col md="6">
          <div className="text-wrap" style={{ fontSize: "20px", fontWeight: "bold" }}><Link to={`/${post.category}/${post.id}`}>{post.title}</Link></div>
          <div>by:{post.author}  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; published on: {new Date(post.timestamp).toLocaleDateString()}</div>
        </Col>

        <Col md="3"><span>comments:{post.commentCount}</span></Col>
        <Col md="1">
          <Link to={{ pathname: "/edit", state: { curr_post: post } }}>
            <button> Edit</button>
          </Link>
        </Col>
      </Row>
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
