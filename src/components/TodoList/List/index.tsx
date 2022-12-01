import React, { FC, ReactElement } from "react";
import { ITodo } from "../typings";
import IdItem from "./Item";

import { List } from "antd";
import moment from "moment";


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

  const insertSort = (arr: ITodo[]) => {
    let final: ITodo[] = new Array(...arr);
    let doneTodoNumber = 0;
    for (let i = 1; i < final.length; i++) {
        let mark: ITodo = final[i];
        let j: number;

        for (j = i - 1; j >= 0; j--) {
            if (final[j].deadline.format() > mark.deadline.format() ) {
                break;
            } else {
                final[j + 1] = final[j];
            }
        }
        final[j + 1] = mark;
    }

    return final;
  }

  const todoListSorted = insertSort(todoList)
  return (
    <List
      itemLayout="horizontal"
      dataSource={todoListSorted}
      size="small"
      renderItem={(todo: ITodo) => (
      <IdItem
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        toggleTodo={toggleTodo}
        nowTimestamp={moment().format()}
      />
      )}
    />
  );
};

export default TdList;
