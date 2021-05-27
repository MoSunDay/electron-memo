import React, { FC, ReactElement } from "react";
import { Space, Checkbox, Button } from "antd";
import { ITodo } from "../typings";

interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const TdItem: FC<IProps> = ({ todo, removeTodo, toggleTodo }): ReactElement => {
  const { id, content, completed } = todo;
  return (
    <Space>
      <Checkbox checked={completed} onChange={() => toggleTodo(id)} />
      <span style={{ textDecoration: completed ? "line-through" : "none" }}>
        {content}
      </span>
      <Button danger onClick={() => removeTodo(id)} type="primary" size="small">
        删除
      </Button>
    </Space>
  );
};

export default TdItem;
