import React, { FC, ReactElement } from "react";
import { Space, Checkbox, Button, List } from "antd";
import { DatePicker, TimePicker } from "antd";
import { ITodo } from "../typings";
import moment from "moment";


interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  nowTimestamp: string;
}

const TdItem: FC<IProps> = ({ todo, removeTodo, toggleTodo, nowTimestamp }): ReactElement => {
  const { id, content, completed, deadline } = todo;
  const deadlineTimestamp = deadline.format();
  return (
    <span>
    <List.Item>
      {
        deadlineTimestamp !== "1970-01-01T00:00:00+08:00" ? 
          <List.Item.Meta
            title={
              <Space>
                <Checkbox checked={completed} onChange={() => toggleTodo(id)}/>
                <span style={{ textDecoration: completed ? "line-through" : "none" , color: nowTimestamp > deadlineTimestamp ? "red" : "black" }}>{content}</span>
              </Space>
            }
            description={
              <Space>
                <Space size="middle">Deadline: </Space>
                <div style={{ width: 108 }}>
                  <DatePicker size="small" defaultValue={deadline} disabled/>
                </div>
                <div style={{ width: 92 }}>
                  <TimePicker
                    size="small"
                    use12Hours
                    format="h:mm a"
                    defaultValue={deadline}
                    disabled
                  />
                </div>
                <Space>
                  <Button shape="circle" size="small" onClick={() => removeTodo(id)}>
                    -
                  </Button>
                </Space>
              </Space>
            }
          /> : <List.Item.Meta
            title={
              <Space>
                <Checkbox checked={completed} onChange={() => toggleTodo(id)}/>
                <span style={{ textDecoration: completed ? "line-through" : "none" }}>{content}</span>
                  <Button shape="circle" size="small" onClick={() => removeTodo(id)}>
                    -
                  </Button>
              </Space>
            }
          />
      }
    </List.Item>
    </span>
  );
};

export default TdItem;
