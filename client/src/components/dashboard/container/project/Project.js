import React, { Component } from "react";
import { connect } from "react-redux";
import { getProject } from "../../../../actions/projectActions";
import {
  getTasks,
  updateTask,
  deleteTask,
} from "../../../../actions/taskActions";

import Spinner from "../../../common/Spinner";
import Modal from "../modal/Modal";

import "../dashboard.scss";
import "./project.scss";

class Project extends Component {
  state = {
    modal: false,
    edit: false,
    editTask: false,
    task: false,
    name: "",
    members: [],
    id: "",
    owner: {},
    tasks: [],
    date: "",
    taskName: "",
    assignee: "",
    complete: false,
    taskId: "",
    dateDue: "",
  };

  toggleModal = (e) => {
    this.setState({
      modal: !this.state.modal,
      edit: false,
      task: false,
      editTask: false,
    });
  };

  toggleEditModal = (name, members, id, owner, e) => {
    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      name: name,
      members: members,
      id: id,
      owner: owner,
    });
  };

  toggleTaskModal = (e) => {
    this.setState({
      modal: !this.state.modal,
      task: !this.state.task,
    });
  };

  toggleEditTaskModal = (taskName, assignee, dateDue, id, e) => {
    this.setState({
      modal: !this.state.modal,
      editTask: !this.state.editTask,
      taskName: taskName,
      assignee: assignee,
      taskId: id,
      dateDue: dateDue,
    });
  };

  toggleComplete(user, owner, id, taskName, assignee, complete, dueDate) {
    let task = {
      user: user,
      owner: owner,
      id: id,
      taskName: taskName,
      dateDue: dueDate,
      assignee: assignee,
      complete: !complete,
    };

    this.props.updateTask(task);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.project);
    this.props.getTasks(this.props.match.params.project);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.project !== prevProps.match.params.project) {
      this.props.getProject(this.props.match.params.project);
      this.props.getTasks(this.props.match.params.project);
    }
  }

  onChange = async (e) => {
    this.setState({ tasks: this.props.tasks });

    let tasks = [...this.state.tasks];

    tasks[e.target.id].taskName = await e.target.value;

    this.setState({ tasks });
  };

  deleteTask(id) {
    this.props.deleteTask(id);
  }

  render() {
    const { tasks } = this.props.tasks;

    if (this.props.projects.projectLoading) {
      return <Spinner />;
    }
    if (this.props.tasks.tasksLoading) {
      return <Spinner />;
    }

    let tasksList = tasks.map((task, index) => (
      <div className="task-input" key={task._id}>
        {/* {this.props.project.owner.email === this.props.auth.user.email ||
        task.assignee === this.props.auth.user.email ||
        task.assignee === "" ? (
          <i
            className="material-icons check-task"
            onClick={this.toggleComplete.bind(
              this,
              this.props.auth.user.email,
              this.props.project.owner.email,
              task._id,
              task.taskName,
              task.assignee,
              task.complete,
              task.dateDue
            )}
          >
            check_circle
          </i>
        ) : (
          <i className="material-icons check-task">check_circle</i>
        )} */}
        <i
          className="material-icons check-task"
          onClick={this.toggleComplete.bind(
            this,
            this.props.auth.user.email,
            this.props.project.owner.email,
            task._id,
            task.taskName,
            task.assignee,
            task.complete,
            task.dateDue
          )}
        >
          check_circle
        </i>
        {task.complete ? (
          <span id={index} name="task" className="project-task">
            <strike>{task.taskName}</strike>
          </span>
        ) : (
          <span id={index} name="task" className="project-task">
            {task.taskName}
          </span>
        )}
        <span className={!task.assignee ? "task-info muted" : "task-info"}>
          {task.assignee === this.props.auth.user.email
            ? "You"
            : task.assignee || "Unassigned"}
        </span>
        <span
          className={
            task.dateDue === "Date undefined" ? "task-info muted" : "task-info"
          }
        >
          {task.dateDue === "Date undefined" ? "Not Set" : task.dateDue}
        </span>
        {this.props.project.owner.id === this.props.auth.user.id ? (
          <>
            <span>
              <i
                className="material-icons check-task"
                onClick={this.toggleEditTaskModal.bind(
                  this,
                  task.taskName,
                  task.assignee,
                  task.dateDue,
                  task._id
                )}
              >
                create
              </i>
            </span>
            <span>
              <i
                className="material-icons check-delete"
                onClick={this.deleteTask.bind(this, task._id)}
              >
                delete
              </i>
            </span>
          </>
        ) : null}
      </div>
    ));

    if (
      this.props.project &&
      this.props.project.teamMembers &&
      !this.props.projects.projectLoading &&
      !this.props.tasks.tasksLoading
    ) {
      const { project } = this.props;

      return (
        <div className="main-content">
          <h1 className="project-header">{project.name}</h1>
          {this.props.project.owner.id === this.props.auth.user.id ? (
            <button
              onClick={this.toggleEditModal.bind(
                this,
                project.name,
                project.teamMembers,
                project._id,
                project.owner
              )}
              className="main-btn center-btn"
            >
              Edit Project Info
            </button>
          ) : null}

          <div className="modal-wrapper">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              task={this.state.task}
              editTask={this.state.editTask}
              name={this.state.name}
              members={this.state.members}
              id={this.state.id}
              owner={this.state.owner}
              taskName={this.state.taskName}
              assignee={this.state.assignee}
              dateDue={this.state.dateDue}
              taskId={this.state.taskId}
            />
          </div>

          {tasks.length === 0 ? (
            <div className="tasks-container">
              <div className="no-projects">
                <p>You have no tasks</p>
                <button
                  className="main-btn add-btn"
                  onClick={this.toggleTaskModal}
                >
                  Create your first task
                </button>
              </div>
            </div>
          ) : (
            <div className="tasks-container">
              <div className="projects-first-row">
                {this.props.project.owner.id === this.props.auth.user.id ? (
                  <button
                    className="main-btn add-btn"
                    onClick={this.toggleTaskModal}
                  >
                    Add task
                  </button>
                ) : (
                  <p className="projects-column-headers">Tasks</p>
                )}
                <div
                  className={
                    this.props.project.owner.id === this.props.auth.user.id
                      ? "projects-column-headers"
                      : "projects-column-headers2"
                  }
                >
                  <p>Assignee</p>
                  <p>Due</p>
                </div>
              </div>
              <div className="project-tasks">{tasksList}</div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="project-spinner">
        <Spinner />
      </div>
    );
  }
}

Project.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  project: state.projects.project,
  projects: state.projects,
  tasks: state.tasks,
});

export default connect(mapStateToProps, {
  getProject,
  getTasks,
  deleteTask,
  updateTask,
})(Project);
