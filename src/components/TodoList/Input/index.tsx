import React, { useState, FC, useRef, ReactElement } from "react";
import { Input, Button, Space } from "antd";
import { ITodo } from "../typings";

interface IProps {
  addTodo: (todo: ITodo) => void;
  todoList: ITodo[];
}

const TdInput: FC<IProps> = ({ addTodo, todoList }): ReactElement => {
  const inputRef = useRef<Input>(null);
  const [inputValue, setInputValue] = useState("");

  const addItem = (): void => {
    if (inputValue.length) {
      const isExist = todoList.find((todo) => todo.content === inputValue);
      if (isExist) {
        alert("已经存在该项目");
        return;
      }

      addTodo({
        id: new Date().getTime(),
        content: inputValue,
        completed: false,
      });

      setInputValue('');
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <Space>
      <Input
        placeholder="备忘点什么呢?"
        maxLength={140}
        style={{ width: 250 }}
        onChange={onChange}
        value={inputValue}
        onPressEnter={onPressEnter}
        ref={inputRef}
      />
      <Button onClick={addItem}>创建</Button>
    </Space>
  );
};

export default TdInput;
