import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import projectsReducer from "./projectReducer";
import tasksReducer from "./tasksReducers";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
});
