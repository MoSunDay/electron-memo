import { ACTION_TYPE, IAction } from "./typings";
import { IState, LState, ITodo } from "./typings";
import arrayMove from "array-move";

let stateTodoList: ITodo[]
let completedIndex: number 
let todoIndex: number 
let toggleDone: boolean
let i: number

function todoReducer(state: IState, action: IAction): IState {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPE.ADD_TODO:
      stateTodoList = state.todoList
      completedIndex = stateTodoList.length
      for (i = 0; i < stateTodoList.length; i++) {
        if (stateTodoList[i].completed === true) {
          completedIndex = i
          break
        }
      }
      stateTodoList = arrayMove([payload as ITodo, ...stateTodoList], 0, completedIndex)
      return {
        ...state,
        todoList: stateTodoList,
      };
    case ACTION_TYPE.REMOVE_TODO:
      return {
        ...state,
        todoList: state.todoList.filter((todo: ITodo) => todo.id !== payload),
      };
    case ACTION_TYPE.TOGGLE_TODO:
      stateTodoList = state.todoList
      completedIndex = stateTodoList.length - 1
      todoIndex = -1
      toggleDone = true;

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
          const offset = todoIndex === stateTodoList.length - 2 && stateTodoList[stateTodoList.length - 1].completed ? 1 : 0
          completedIndex = completedIndex === stateTodoList.length - 1 ? completedIndex : completedIndex - 1
          stateTodoList = arrayMove(stateTodoList, todoIndex, completedIndex - offset)
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

function lReducer(state: LState, action: IAction): LState {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPE.SET_LOADING:
      return {
        ...state,
        loading: payload as boolean,
      };
      case ACTION_TYPE.UNSET_LOADING:
        return {
          ...state,
          loading: payload as boolean,
        };
    default:
      return state;
  }
}

export { todoReducer, lReducer };