import React, { FC, ReactElement } from "react";
import { SortableContainer } from "react-sortable-hoc";
import arrayMove from "array-move";
import { List } from "antd";

import { ITodo } from "../typings";
import IdItem from "./Item";
import "./list.css";

interface IProps {
  todoList: ITodo[];
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  initTodo: (todos: ITodo[]) => void;
}

const TdList: FC<IProps> = ({
  todoList,
  removeTodo,
  toggleTodo,
  initTodo,
}): ReactElement => {
  const SortableList = SortableContainer(({ items }) => {
    return (
      <List>
        {items.map((todo: ITodo, index: number) => (
          <IdItem
            key={`${todo.id}`}
            index={index}
            todo={todo}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
          />
        ))}
      </List>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    initTodo(arrayMove(todoList, oldIndex, newIndex));
    console.log(todoList)
  };
  return <SortableList disableAutoscroll items={todoList} onSortEnd={onSortEnd} helperClass="row-dragging"/>;
};

export default TdList;
