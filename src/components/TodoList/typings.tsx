import moment from "moment";


export interface ITodo {
  id: number;
  content: string;
  deadline: moment.Moment;
  completed: boolean;
}

export interface IState {
  todoList: ITodo[];
}

export interface LState {
  loading: boolean;
}

export interface IAction {
  type: ACTION_TYPE;
  payload: ITodo | number | ITodo[] | boolean;
}

export enum ACTION_TYPE {
  ADD_TODO = "addTodo",
  REMOVE_TODO = "removeTodo",
  TOGGLE_TODO = "toggleTodo",
  INIT_TODOLIST = "initTodoList",
  SET_LOADING = 'setLoding',
  UNSET_LOADING = 'unSetLoding',
}
