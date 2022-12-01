import React, { FC, ReactElement } from "react";
import { ITodo } from "../typings";
import IdItem from "./Item";

import { List } from "antd";


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
    <List
      itemLayout="horizontal"
      dataSource={todoList}
      size="small"
      renderItem={(todo: ITodo) => (
      <IdItem
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        toggleTodo={toggleTodo}
      />
      )}
    />
  );
};

export default TdList;
