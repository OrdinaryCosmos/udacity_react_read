import { combineReducers } from "redux";
import {
  LOADCATEGORY,
  CHANGEPOST,
  GETPOSTSOFCATEGORY,
  CURRENTPOST,
  CURRENTCOMMENT,
  UPDATEVOTEWITHID,
  UPDATECURRENTPOST,
  SORTPOST,
  UPDATECOMMENT,
  ADDNEWCOMMENT
} from "./actions.js";

const categoryReducer = (state = [], action) => {
  switch (action.type) {
    case LOADCATEGORY:
      return action.payload;
    default:
      return state;
  }
};

const postReducer = (state = [], action) => {
  switch (action.type) {
    case CHANGEPOST:
      return action.payload;

    case UPDATEVOTEWITHID:
      const { id, upOrDown } = action.payload;
      let newState = [];
      state.forEach(post => {
        if (post.id === id) {
          newState.push({
            ...post,
            voteScore:
              upOrDown === "up" ? post.voteScore + 1 : post.voteScore - 1
          });
        } else {
          newState.push(post);
        }
      });
      return newState;

    case SORTPOST:
      const { accordingTo, order } = action.payload;
      return [...state].sort((a, b) => {
        return order === "lowToHigh"
          ? a[accordingTo] - b[accordingTo]
          : b[accordingTo] - a[accordingTo];
      });
    default:
      return state;
  }
};

const commentReducer = (state = [], action) => {
  switch (action.type) {
    case CURRENTCOMMENT:
      return action.payload;
      break;

    case UPDATECOMMENT:
      let newstate = [];
      state.forEach(comm => {
        if (comm.id === action.payload.id) {
          newstate.push(action.payload);
        } else {
          newstate.push(comm);
        }
      });
      return newstate;

    case ADDNEWCOMMENT:
      return [...state, action.payload]
    default:
      return state;
      break;
  }
};

const currpostReducer = (state = {}, action) => {
  switch (action.type) {
    case CURRENTPOST:
      return action.payload;
      break;
    case UPDATEVOTEWITHID:
      const { upOrDown, id } = action.payload;
      if (id === state.id) {
        return {
          ...state,
          voteScore:
            upOrDown === "up" ? state.voteScore + 1 : state.voteScore - 1
        };
      }
    default:
      return state;
      break;
  }
};

export default combineReducers({
  categories: categoryReducer,
  posts: postReducer,
  comments: commentReducer,
  curr_post: currpostReducer
});
