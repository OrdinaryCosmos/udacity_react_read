import axios from "axios";
import {
  LOADCATEGORY,
  UPDATEVOTEWITHID,
  UPDATECURRENTPOST,
  SORTPOST,
  UPDATECOMMENT
} from "./actions";

export const getCategories = dispatch => {
  console.log("getcatergory is called");
  axios
    .get("/categories", { headers: { Authorization: "Bearer" } })
    .then(resp => {
      dispatch({
        type: LOADCATEGORY,
        payload: resp.data.categories.map(data => data.name)
      });
    });
};

export const vote = (upOrDown, id) => {
  return dispatch =>
    axios
      .post(
        `/posts/${id}`,
        { option: upOrDown + "Vote" },
        { headers: { Authorization: "Bearer" } }
      )
      .then(resp => {
        console.log("voting result", resp);
        dispatch({ type: UPDATEVOTEWITHID, payload: { upOrDown, id } });
      });
};
export const voteComment = (upOrDown, id) => {
  return dispatch =>
    axios
      .post(
        `/posts/${id}`,
        { option: upOrDown + "Vote" },
        { headers: { Authorization: "Bearer" } }
      )
      .then(resp => {
        console.log("voting result", resp);
        dispatch({ type: UPDATEVOTEWITHID, payload: { upOrDown, id } });
      });
};

export const changeSort = e => {
  return dispatch => {
    console.log("this is select sort", e.target.value);
    const [accordingTo, order] = e.target.value.split(" ");
    dispatch({ type: SORTPOST, payload: { accordingTo, order } });
  };
};

export const updateComment = (cb, comment) => {
  return dispatch => {
    axios
      .put(
        `/comments/${comment.id}`,
        { timestamp: comment.timestamp, body: comment.body },
        { headers: { Authorization: "Bearer" } }
      )
      .then(resp => {
        console.log("update comment", resp);
        dispatch({ type: UPDATECOMMENT, payload: resp.data });
        cb();
      });
  };
};
