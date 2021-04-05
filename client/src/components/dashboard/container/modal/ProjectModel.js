import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../../../../actions/projectActions";

import moment from "moment";

import "./modal.scss";

class ProjectModal extends Component {
  state = {
    projectName: "",
    members: [{ name: "", email: "" }],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit) {
      this.setState({
        projectName: nextProps.name,
        members: nextProps.members,
      });
    } else if (nextProps.editTask) {
      this.setState({
        taskName: nextProps.taskName,
      });
    }
  }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.edit !== this.props.edit) {
  //     this.setState({
  //       projectName: prevProps.name,
  //       members: prevProps.members,
  //     });
  //   } else if (prevProps.editTask !== this.props.editTask) {
  //     this.setState({
  //       taskName: prevProps.taskName,
  //     });
  //   }
  // }

  onChange = (e) => {
    if (["name", "email"].includes(e.target.name)) {
      let members = [...this.state.members];
      members[e.target.dataset.id][e.target.name] = e.target.value;
      this.setState({ members });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  addMember = (e) => {
    this.setState((prevState) => ({
      members: [...prevState.members, { name: "", email: "" }],
    }));
  };

  deleteMember = (index) => {
    let array = [...this.state.members];
    array.splice(index, 1);
    this.setState({ members: array });
  };

  createProject = () => {
    let project = {
      projectName: this.state.projectName,
      members: this.state.members,
    };

    this.props.createProject(project);
    this.onClose();
  };

  updateProject = async (id) => {
    let project = {
      id: this.props.id,
      projectName: this.state.projectName,
      members: this.state.members,
    };

    await this.props.updateProject(project);

    this.onClose();
    window.location.reload();
  };

  deleteProject = (id) => {
    this.props.deleteProject(id, this.props.history);
    this.onClose();
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      projectName: "",
      members: [{ name: "", email: "" }],
    });
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    if (!this.props.modal) {
      return null;
    }

    document.onkeyup = (e) => {
      if (e.keyCode === 27 && this.props.modal) {
        this.onClose();
      }
    };

    let { members } = this.state;

    // Edit project modal
    if (this.props.edit) {
      return (
        <div className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Edit Project Info</h1>
          <p className="created-by">
            Created by {this.props.owner.name} ({this.props.owner.email})
          </p>
          <div className="form-group">
            <label>
              <div className="form-label">Project Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder={"My Awesome Project"}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-label">Add team members (optional)</div>
          <button className="main-btn add-members" onClick={this.addMember}>
            Add team members
          </button>
          <div className="members-edit">
            {members.map((val, id) => {
              let memberId = `member-${id}`,
                emailId = `email-${id}`;
              return (
                <div className="split" key={id}>
                  <label className="form-label" htmlFor={memberId}>
                    Name (required for teams)
                    <input
                      type="text"
                      name="name"
                      data-id={id}
                      id={memberId}
                      value={members[id].name}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <label className="form-label split-email" htmlFor={emailId}>
                    Email (required for teams)
                    <input
                      type="text"
                      name="email"
                      data-id={id}
                      id={emailId}
                      value={members[id].email}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <span
                    className="delete"
                    onClick={this.deleteMember.bind(this, id)}
                  >
                    REMOVE
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            {/* {this.props.owner.id === this.props.auth.user.id ? ( */}
            <button
              className="main-btn update-project"
              onClick={this.updateProject.bind(this, this.props.id)}
            >
              Update Project
            </button>
            {/* ) : null} */}
            {/* <button
              className="main-btn update-project"
              onClick={this.updateProject.bind(this, this.props.id)}
            >
              Update Project
            </button> */}
            {this.props.owner.id === this.props.auth.user.id ? (
              <button
                className="main-btn delete-project"
                onClick={this.deleteProject.bind(this, this.props.id)}
              >
                Delete Project
              </button>
            ) : null}
          </div>
        </div>
      );
    }

    // Create project modal
    else
      return (
        <div className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Create a project</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Project Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder="My Awesome Project"
                className="form-input"
              />
            </label>
          </div>
          <div className="form-label">Add team members (optional)</div>
          <button className="main-btn add-members" onClick={this.addMember}>
            Add team member
          </button>
          <div className="members">
            {members.map((val, id) => {
              let memberId = `member-${id}`,
                emailId = `email-${id}`;
              return (
                <div className="split" key={id}>
                  <label className="form-label" htmlFor={memberId}>
                    Name (required for teams)
                    <input
                      type="text"
                      name="name"
                      data-id={id}
                      id={memberId}
                      value={members[id].name}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <label className="form-label split-email" htmlFor={emailId}>
                    Email (required for teams)
                    <input
                      type="text"
                      name="email"
                      data-id={id}
                      id={emailId}
                      value={members[id].email}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <span
                    className="delete"
                    onClick={this.deleteMember.bind(this, id)}
                  >
                    REMOVE
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            <button
              className="main-btn create-project"
              onClick={this.createProject}
            >
              Create Project
            </button>
          </div>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  projects: state.projects,
  tasks: state.tasks,
});

export default connect(mapStateToProps, {
  createProject,
  updateProject,
  deleteProject,
})(withRouter(ProjectModal));
