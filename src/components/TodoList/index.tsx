import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState
} from "react";
import { Space, Card, Button } from "antd";

import TdInput from "./Input";
import TdList from "./List";
import Reflush from "./Reflush";
import { todoReducer, lReducer } from "./reducer";
import { ITodo, IState, LState, ACTION_TYPE } from "./typings";
import moment from "moment";

function init(initTodoList: ITodo[]): IState {
  return {
    todoList: initTodoList,
  };
}

function initL(): LState {
  return {
    loading: false,
  };
}

const TodoList: FC = (): ReactElement => {
  const [state, dispatch] = useReducer(todoReducer, [], init);
  const [lstate, lDispatch] = useReducer(lReducer, true, initL);
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    document.title = "小小备忘录";
    const todoList = JSON.parse(localStorage.getItem("todoList") || "[]").map((todo: ITodo) => ({
      ...todo,
      deadline: moment(todo.deadline)
    })); 
    dispatch({
      type: ACTION_TYPE.INIT_TODOLIST,
      payload: todoList,
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(state.todoList));
  }, [state.todoList]);

  const addTodo = useCallback((todo: ITodo): void => {
    dispatch({
      type: ACTION_TYPE.ADD_TODO,
      payload: todo,
    });
  }, []);

  const removeTodo = useCallback((id: number): void => {
    dispatch({
      type: ACTION_TYPE.REMOVE_TODO,
      payload: id,
    });
  }, []);

  const toggleTodo = useCallback((id: number): void => {
    dispatch({
      type: ACTION_TYPE.TOGGLE_TODO,
      payload: id,
    });
  }, []);

  const initTodo = useCallback((todos: ITodo[]): void => {
    dispatch({
      type: ACTION_TYPE.INIT_TODOLIST,
      payload: todos,
    });
  }, []);

  const setLoading = useCallback((loading: boolean): void => {
    lDispatch({
      type: ACTION_TYPE.SET_LOADING,
      payload: loading,
    });
  }, []);

  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const reFlush = () => {
    setGLoading(true);
    sleep(250).then(() => {
      setGLoading(false);
    });
  }

  return (
    <Card title="小小备忘录" style={{ width: 400, margin: 20, height: "auto" }} loading={gLoading} extra={<Button onClick={() => reFlush() }>刷新</Button>}>
      <Space direction="vertical">
        <div style={{ paddingLeft: 14 }}>
          <div style={{ paddingBottom: 14 }}>
            <TdInput addTodo={addTodo} todoList={state.todoList} />
          </div>
          <Reflush
            setLoading={setLoading}
          />
          <TdList
            todoList={state.todoList}
            loading={lstate.loading}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
            initTodo={initTodo}
          />
        </div>
      </Space>
    </Card>
  );
};

export default TodoList;
