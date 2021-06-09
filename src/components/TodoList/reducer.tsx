import { ACTION_TYPE, IAction } from "./typings";
import { IState, ITodo } from "./typings";
import arrayMove from "array-move";

function todoReducer(state: IState, action: IAction): IState {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPE.ADD_TODO:
      return {
        ...state,
        todoList: [payload as ITodo, ...state.todoList],
      };
    case ACTION_TYPE.REMOVE_TODO:
      return {
        ...state,
        todoList: state.todoList.filter((todo: ITodo) => todo.id !== payload),
      };
    case ACTION_TYPE.TOGGLE_TODO:
      let stateTodoList = state.todoList
      let completedIndex = stateTodoList.length - 1
      let todoIndex = -1
      let toggleDone = true;
      let i: number

      for (i = 0; i < stateTodoList.length; i++) {
        if (todoIndex !== -1 && completedIndex !== stateTodoList.length - 1) {
          break
        }
        if (stateTodoList[i].id === payload) {
          todoIndex = i
          stateTodoList[i].completed = !stateTodoList[i].completed
          toggleDone = stateTodoList[i].completed
          continue
        }
        if (stateTodoList[i].completed === true && completedIndex === stateTodoList.length - 1) {
          completedIndex = i
        }
      }
      if (todoIndex !== -1) {
        if (toggleDone) {
          completedIndex = completedIndex === stateTodoList.length - 1 ? completedIndex : completedIndex - 1
          stateTodoList = arrayMove(stateTodoList, todoIndex, completedIndex)
        } else {
          completedIndex = todoIndex < completedIndex ? completedIndex - 1 : completedIndex
          stateTodoList = arrayMove(stateTodoList, todoIndex, completedIndex)
        }
      }
      return {
        ...state,
        todoList: stateTodoList,
      };
    case ACTION_TYPE.INIT_TODOLIST:
      return {
        ...state,
        todoList: payload as ITodo[],
      };
    default:
      return state;
  }
}

export { todoReducer };
