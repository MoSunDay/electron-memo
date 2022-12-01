import React, { FC, ReactElement, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [initTask, setInitTask] = useState(false);

  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const reFlush = () => {
    setLoading(true);
    sleep(300).then(() => {
      setLoading(false);
    });
  }
  if (!initTask) {
    setInitTask(true);
    setInterval(() => reFlush(), 90 * 1000);
  }

  const SortableList = SortableContainer(({ items }) => {
    return (
      <List loading={loading}>
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
  const sortList = (arr: ITodo[]): void => {
    initTodo([
      ...arr.filter((element, index, array) => {
        if (element.completed === false) {
          return element;
        }
      }),
      ...arr.filter((element, index, array) => {
        if (element.completed === true) {
          return element;
        }
      }),
    ])
  };

  // setInterval(() => sortList(todoList), 3000);

  const onSortEnd = ({ oldIndex, newIndex }): void => {
    todoList = arrayMove(todoList, oldIndex, newIndex)
    initTodo(todoList);
    if (todoList.length >= 2) {
      if (newIndex === 0) {
        if (todoList[newIndex].completed === true && todoList[newIndex+1].completed === false) {
          sortList(todoList);
          return;
        }
      } else if (newIndex === todoList.length - 1) {
        if (todoList[newIndex].completed === false && todoList[newIndex-1].completed === true) {
          sortList(todoList);
          return;
        }
      } else if (todoList[newIndex+1].completed !== todoList[newIndex].completed && todoList[newIndex].completed !== todoList[newIndex-1].completed) {
        sortList(todoList);
        return;
      }
    }
  };
  return <SortableList distance={8} items={todoList} onSortEnd={onSortEnd}/>;
};

export default TdList;
