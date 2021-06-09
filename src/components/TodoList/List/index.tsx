import React, { FC, ReactElement } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
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
    // const SortableItem = SortableElement(({value}) => <li>{value}</li>);
    // return (
    //   <div>
    //     {items.map((todo: ITodo, index: number) => (
    //       <SortableItem key={`item-${todo.id}`} index={index} value={todo.content} />
    //     ))}
    //   </div>
    // );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    initTodo(arrayMove(todoList, oldIndex, newIndex));
  };
  return <SortableList distance={1} items={todoList} onSortEnd={onSortEnd}/>;
};

export default TdList;
