import React from "react";

import "./App.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import mainReducer from "./reducers";
import Root from "./component/Root";
import Post from "./component/Post";
import Edit from "./component/Edit";
import NotFound from "./component/NotFound";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const store = createStore(
    mainReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/edit" component={Edit} />
          <Route exact path="/:selectC?" component={Root} />
          <Route exact path="/:catergory/:postid" component={Post} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
