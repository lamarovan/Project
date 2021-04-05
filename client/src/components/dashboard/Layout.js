import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  matchPath,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { connect } from "react-redux";
import { getProjects } from "../../actions/projectActions";

import Spinner from "../common/Spinner";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import Dashboard from "./container/Dashboard";
import Project from "./container/project/Project";
import NotFound from "../404/404";

import "./layout.scss";

class Layout extends Component {
  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    const { projects, projectsLoading } = this.props.projects;

    let dashboardContent;

    if (projects === null || projectsLoading) {
      dashboardContent = <Spinner />;
    } else if (projects.length > 0) {
      dashboardContent = (
        <>
          <Sidebar projects={projects} />
          <div className="right">
            <Navbar />
            <Switch>
              <Route
                exact
                path="/dashboard"
                projects={projects}
                component={Dashboard}
              />
              <Route exact path="/projects/:project" component={Project} />
              {/* <Route
                exact
                path="/projects/:project"
                render={(matchProps) => (
                  <Project
                    {...matchProps}
                    {...this.props}
                    handleMatch={this.handleMatch}
                  />
                )}
              /> */}
              {/* <Project props={this.props.projects.project} /> */}
              {/* </Route> */}
              <Route component={NotFound} />
            </Switch>
          </div>
        </>
      );
    } else {
      dashboardContent = (
        <>
          <Sidebar />
          <div className="right">
            <Navbar />
            <Switch>
              <Route
                exact
                path="/dashboard"
                projects={[]}
                component={Dashboard}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </>
      );
    }

    return (
      <Router>
        <div className="wrapper">{dashboardContent}</div>
      </Router>
    );
  }
}

Layout.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  projects: state.projects,
});

export default withRouter(
  connect(mapStateToProps, {
    getProjects,
  })(Layout)
);
