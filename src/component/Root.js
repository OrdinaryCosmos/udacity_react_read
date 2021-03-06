import React, { Component } from "react";
import axios from "axios";
import { CHANGEPOST } from "../actions";
import { connect } from "react-redux";
import Header from "./Header";
import PostListItem from "./PostListItem";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class Root extends Component {
  componentDidMount() {
    console.log(" root component did mount is called ");
    const {
      match: {
        params: { selectC }
      }
    } = this.props;
    console.log("sec", selectC);

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
    const sortHash = {
      "timestamp lowToHigh": "published time - old to new",
      "timestamp highToLow": "published time - new to old",
      "voteScore lowToHigh": "vote score - low to high",
      "voteScore highToLow": "vote score - high to low"
    };
    return (
      <Container fluid={true}>
        <Header />
        <Row>
          <Col md={{ span: 8, offset: 1 }}>
            <Container
              fluid={true}
              style={{
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "#007bff",
                padding: "0"
              }}
            >
              <Col
                xs={12}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "5px"
                }}
              >
                <Button style={{ color: "white" }}>Sort by</Button>

                <DropdownButton
                  style={{ display: "inline-block" }}
                  size="sm"
                  variant="secondary"
                  id="dropdown-item-button"
                  title={sortHash[this.state.sortOrder]}
                >
                  {Object.keys(sortHash).map(item => (
                    <Dropdown.Item
                      as="button"
                      key={item}
                      onClick={e => {
                        this.setState({ sortOrder: item });
                      }}
                    >
                      {sortHash[item]}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col>

              {this.props.posts
                .filter(post => post.deleted === false)
                .sort((a, b) => {
                  const [accordingTo, order] = this.state.sortOrder.split(" ");
                  return order === "lowToHigh"
                    ? a[accordingTo] - b[accordingTo]
                    : b[accordingTo] - a[accordingTo];
                })
                .map(post => (
                  <PostListItem key={post.id} post={post} />
                ))}
            </Container>
          </Col>
          <Col md="3">
            <div>tags</div>
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Root);
