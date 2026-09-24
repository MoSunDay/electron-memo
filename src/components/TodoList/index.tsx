import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useRef
} from "react";

import TdInput from "./Input";
import TdList from "./List";
import { todoReducer } from "./reducer";
import { ITodo, IState, ACTION_TYPE } from "./typings";
import moment from "moment";

function init(initTodoList: ITodo[]): IState {
  return {
    todoList: initTodoList,
  };
}

const TodoList: FC = (): ReactElement => {
  const [state, dispatch] = useReducer(todoReducer, [], init);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // 窗口高度随内容自适应：上报自然高度，主进程负责 clamp 与 setContentSize
  useEffect(() => {
    const ipc = (window as any).require?.("electron")?.ipcRenderer;
    if (!ipc) return;
    let raf = 0;
    const report = () => {
      raf = 0;
      // 上下内边距从实际样式读取，避免与 padding 手工耦合
      const style = rootRef.current ? getComputedStyle(rootRef.current) : null;
      const padV = style ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 0;
      const inputH = inputAreaRef.current?.offsetHeight ?? 0;
      const listH = contentRef.current?.scrollHeight ?? 0;
      ipc.send("memo-content-height", padV + inputH + listH);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(report);
    };
    const ro = new ResizeObserver(schedule);
    if (inputAreaRef.current) ro.observe(inputAreaRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    schedule();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

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

  return (
    <div
      ref={rootRef}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "10px 12px",
        textAlign: "left",
        background: "#fafafa",
      }}
    >
      <div
        ref={inputAreaRef}
        style={{ flexShrink: 0, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}
      >
        <TdInput addTodo={addTodo} todoList={state.todoList} />
      </div>
      <div className="memo-scroll" style={{ flex: 1, minHeight: 0 }}>
        <div ref={contentRef}>
          <TdList
            todoList={state.todoList}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
            initTodo={initTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
