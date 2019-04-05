
import './App.scss';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./Pages/Main";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import '@material/react-top-app-bar/index.scss';
import '@material/react-material-icon/index.scss';
// import Drawer, {
//   DrawerHeader,
//   DrawerSubtitle,
//   DrawerTitle,
//   DrawerContent,
// } from '@material/react-drawer';
import Drawer, { DrawerAppContent } from '@material/react-drawer';
import '@material/react-drawer/index.scss';

import MaterialIcon from '@material/react-material-icon';
import Button from '@material/react-button';

import { Provider } from "react-redux";
import store from "./store";

// import Category from "./Pages/Category";
// import Search from "./Pages/Search";
import NewPost from "./Pages/NewPost";
import NoMatch from "./Pages/NoMatch";
import Detail from "./Pages/Detail";
import Navbar from "./Components/Navbar";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
// import Landing from "./Pages/Landing";
import API from './utils/API'
import PrivateRoute from "./Pages/private-route/PrivateRoute";
// import Dashboard from "./Pages/dashboard/Dashboard";
import LogoutBtn from "./Components/LogoutBtn";
import Jumbotron from "react-bootstrap/Jumbotron"
import authReducers from './reducers/authReducers';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends React.Component {
  state = {
    cards: [],
    category: "",
    open: false,
    search: "",
    categories: [
      "All",
      "Electronics",
      "Appliances",
      "Clothing",
      "Household",
      "Sports",
      "Movies and Games",
      "Machinary",
      "Tools",
      "Space"]
  };

  loadPopPosts = () => {
    API.getPopPosts()
      .then(res => {
        this.setState({ cards: res.data });
        console.log(res.data)
      }
      )
      .catch(err => console.log(err));
  };
  handleCategoryChange = (category) => {
    if (category === "All") {
      this.loadPopPosts();
    } else {
      API.getCategoryPosts(category)
        .then(res => {
          this.setState({ cards: res.data, category });
          console.log(res.data)
        }
        )
        .catch(err => console.log(err));
    }
  }
  handleSearch = (search) => {
    API.search(search)
      .then(res => {
        this.setState({ cards: res.data, search });
        console.log(res.data)
      }
      )
      .catch(err => console.log(err));
  }


  componentDidMount() {
    this.loadPopPosts();
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            {store.auth.dispatch('isAuthenticated') === true ? (
              <div>
                <Drawer
                  modal
                  open={this.state.open}
                  onClose={() => this.setState({ open: false })}
                >
                  <Button>What up?!</Button>
                  {this.state.categories.map(category => (
                    // <CategoryWrapper
                    // key = {category}
                    // category={category}
                    // handleCategoryChange= {this.props.handleCategoryChange(category)}
                    // />
                    <div className="each-nav-item" onClick={
                      (e) => {
                        e.preventDefault()
                        this.handleCategoryChange(category)
                      }}>
                      {category}
                    </div>
                  ))}
                </Drawer>
                <TopAppBar>
                  <TopAppBarRow>
                    <TopAppBarSection align='start'>
                      <TopAppBarIcon navIcon tabIndex={0}>
                        <MaterialIcon hasRipple icon='menu' onClick={() => this.setState({ open: !this.state.open })} />
                      </TopAppBarIcon>
                      <TopAppBarTitle>TheMinimalist</TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection align='end' role='toolbar'>
                      <TopAppBarIcon actionItem tabIndex={0}>
                        <MaterialIcon
                          aria-label="print page"
                          hasRipple
                          icon='print'
                          onClick={() => console.log('print')}
                        />
                      </TopAppBarIcon>
                      <TopAppBarIcon actionItem tabIndex={0}>
                        <LogoutBtn />
                      </TopAppBarIcon>
                      {/* <TopAppBarIcon actionItem tabIndex={0}>
                    <MaterialIcon
                      aria-label="Logout"
                      hasRipple
                      icon='logout'
                      onClick={() => console.log('print')}
                    />
                  </TopAppBarIcon> */}
                    </TopAppBarSection>
                  </TopAppBarRow>
                </TopAppBar>
                <TopAppBarFixedAdjust>
                </TopAppBarFixedAdjust>
              </div>
            ) : (<Jumbotron>
              Hi there
        </Jumbotron>
              )
            }
            <div className="main-container">

              <div className="main-content">
                <Switch>
                  <PrivateRoute exact path="/" render={(props) => <Main {...props} cards={this.state.cards} />} />
                  {/* <PrivateRoute exact path="/" component={Main} cards={this.state.cards} /> */}
                  {/* <Route exact path="/" component={Main} cards={this.state.cards} /> */}
                  {/* <Route exact path="/land" component={Landing} /> */}
                  {/* <PrivateRoute exact path="/dash" component={Dashboard} /> */}
                  <PrivateRoute exact path="/newpost" component={NewPost} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  {/* <Route exact path="/category/:category" component={Category} />
            <Route exact path="/search/:search" component={Search} /> */}
                  <PrivateRoute exact path="/:id" component={Detail} />
                  <PrivateRoute component={NoMatch} />
                </Switch>
              </div>
            </div>
            {/* <LogoutBtn /> */}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;