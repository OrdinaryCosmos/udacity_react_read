import React, { Component, createRef } from "react";
import axios from "axios";
import { CHANGEPOST } from "../actions";
import { connect } from "react-redux";
import Header from "./Header";
import PostListItem from "./PostListItem";
import { Link } from "react-router-dom";
import { changeSort } from "../action_creators";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class Root extends Component {
  componentDidMount() {
    console.log(" root component did mount is called ");
    const {
      match: {
        params: { selectC }
      }
    } = this.props;
    if (typeof selectC === "undefined") {
      // the catergory is not specified, so show all the posts
      this.props.getAllPost();
    } else {
      this.props.getPostsForCateg(selectC);
    }
  }

  componentDidUpdate(prevProps) {
    const selectC = this.props.match.params.selectC;
    const prevSelectC = prevProps.match.params.selectC;
    if (selectC !== prevSelectC) {
      // only update if path changes, to prevent updating loop
      if (typeof selectC === "undefined") {
        this.props.getAllPost();
      } else {
        this.props.getPostsForCateg(selectC);
      }
    } // if the route changes, get the posts again
  }

  state = { sortOrder: "timestamp lowToHigh" };


  render() {
    return (
      <Container>
        <Header />
        <div>
          <div>
            <select
              onChange={e => {
                this.setState({ sortOrder: e.target.value });
              }}
              value={this.state.sortOrder}
            >
              <option value="timestamp lowToHigh">
                published time: from old to new
              </option>
              <option value="timestamp highToLow">
                published time: from new to order
              </option>
              <option value="voteScore lowToHigh">
                vote score:from low to high
              </option>
              <option value="voteScore highToLow">
                vote score:from high to low
              </option>
            </select>
          </div>
          <ol>
            {this.props.posts
              .filter(post => post.deleted === false)
              .sort((a, b) => {
                const [accordingTo, order] = this.state.sortOrder.split(" ");
                return order === "lowToHigh"
                  ? a[accordingTo] - b[accordingTo]
                  : b[accordingTo] - a[accordingTo];
              })
              .map(post => (
                <PostListItem post={post} />
              ))}
          </ol>
        </div>
      </Container>
    );
  }
}

function getAllPost(dispatch) {
  axios.get("/posts", { headers: { Authorization: "Bearer" } }).then(resp => {
    dispatch({ type: CHANGEPOST, payload: resp.data });
    console.log("getallpost", resp.data);
  });
}
function getPostsForCateg(selectC) {
  return dispatch => {
    axios
      .get(`/${selectC}/posts`, { headers: { Authorization: "Bearer" } })
      .then(resp => {
        dispatch({ type: CHANGEPOST, payload: resp.data });
        console.log("getpostsforcaterg", resp);
      });
  };
}

function mapStateToProps(state) {
  return {
    posts: state.posts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllPost: () => dispatch(getAllPost),
    getPostsForCateg: selectC => {
      dispatch(getPostsForCateg(selectC));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
