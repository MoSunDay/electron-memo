import React, { useState, FC, ReactElement, useEffect, useRef } from "react";
import { Input, Button, Space } from "antd";
import moment from "moment";
import { DatePicker, TimePicker, Checkbox } from "antd";
import { ITodo } from "../typings";

interface IProps {
  addTodo: (todo: ITodo) => void;
  todoList: ITodo[];
}

const TdInput: FC<IProps> = ({ addTodo, todoList }): ReactElement => {
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

  const inputOnChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setInputValue(e.currentTarget.value);
  };

  // 输入法组合状态标记，组合中的 Enter 属于输入法上屏，不触发创建
  const composingRef = useRef(false);

  const onCompositionStart = (): void => {
    composingRef.current = true;
  };

  const onCompositionEnd = (): void => {
    composingRef.current = false;
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // 组合中的 Enter 属于输入法上屏，不触发创建
      if (composingRef.current || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) {
        return;
      }
      e.preventDefault(); // 回车=创建，不落换行符
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Space>
        <Space>Deadline</Space>
        <Checkbox onChange={() => tiggerEnableDeadline()} />
      </Space>
      <Input.TextArea
        placeholder="备忘点什么呢?"
        maxLength={140}
        autoSize={{ minRows: 1, maxRows: 4 }}
        onChange={inputOnChange}
        value={inputValue}
        onPressEnter={onPressEnter}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
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
    </div>
  );
};

export default TdInput;
