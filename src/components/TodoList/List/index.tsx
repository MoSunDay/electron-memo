import React, { FC, ReactElement } from "react";
import { Space } from "antd";
import { ITodo } from "../typings";
import IdItem from "./Item";

interface IProps {
  todoList: ITodo[];
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
}

const TdList: FC<IProps> = ({
  todoList,
  removeTodo,
  toggleTodo,
}): ReactElement => {
  return (
    <Space direction="vertical">
      {todoList &&
        todoList.map((todo: ITodo) => {
          return (
            <IdItem
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              toggleTodo={toggleTodo}
            />
          );
        })}
    </Space>
  );
};

export default TdList;
