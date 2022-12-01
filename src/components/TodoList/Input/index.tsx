import React, { useState, FC, useRef, ReactElement, useEffect } from "react";
import { Input, Button, Space } from "antd";
import moment from "moment";
import { DatePicker, TimePicker, Checkbox } from "antd";
import { ITodo } from "../typings";

interface IProps {
  addTodo: (todo: ITodo) => void;
  todoList: ITodo[];
}

const TdInput: FC<IProps> = ({ addTodo, todoList }): ReactElement => {
  const inputRef = useRef<Input>(null);
  const [dateValue, setdateVale] = useState(moment("1970-01-01 00:00:00", "YYYY-MM-DD HH:mm:ss"));

  const [enableDeadline, setEnableDeadline] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {}, [enableDeadline]);

  const addItem = (): void => {
    if (inputValue.length) {
      const isExist = todoList.find((todo) => todo.content === inputValue);
      if (isExist) {
        alert("已经存在该项目");
        return;
      }

      addTodo({
        id: new Date().getTime(),
        deadline: dateValue,
        content: inputValue,
        completed: false,
      });

      console.log(`${dateValue}`)
      setInputValue("");
    }
  };

  const inputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const dateTimeOnChange = (value: moment.Moment | null) => {
    if (value !== null) {
      setdateVale(value);
      console.log(value);
    }
  };

  const tiggerEnableDeadline = () => {
    const currentValue: boolean = !enableDeadline;
    setEnableDeadline(currentValue);
    if (!currentValue) {
      setdateVale(moment("1970-01-01 00:00:00", "YYYY-MM-DD HH:mm:ss"))
    } else {
      setdateVale(moment())
    }
  };

  return (
    <div>
    <Space direction="vertical">
      <Space>
        <Space>Deadline</Space>
        <Checkbox onChange={() => tiggerEnableDeadline()} />
      </Space>
      <Input
        placeholder="备忘点什么呢?"
        maxLength={140}
        style={{ width: 320 }}
        onChange={inputOnChange}
        value={inputValue}
        onPressEnter={onPressEnter}
        ref={inputRef}
      />
      <Space>
        {enableDeadline === true ? (
          <Space>
            <div style={{ width: 128 }}>
              <DatePicker size="middle" value={dateValue} onChange={dateTimeOnChange} />
            </div>
            <div style={{ width: 112 }}>
              <TimePicker
                size="middle"
                use12Hours
                format="h:mm a"
                value={dateValue}
                onChange={dateTimeOnChange}
              />
            </div>
          </Space>
        ) : (
          <Space></Space>
        )}
        <Button onClick={addItem}>创建</Button>
      </Space>
    </Space>
    </div>
  );
};

export default TdInput;
