import React, { FC, ReactElement } from "react";
import { Space, Checkbox, Button, List } from "antd";
import { DatePicker, TimePicker } from "antd";
import { ITodo } from "../typings";


interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const TdItem: FC<IProps> = ({ todo, removeTodo, toggleTodo }): ReactElement => {
  const { id, content, completed, deadline } = todo;


  return (
    <span>
    <List.Item>
      {
        deadline.format() !== "1970-01-01T00:00:00+08:00" ? 
          <List.Item.Meta
            title={
              <Space>
                <Checkbox checked={completed} onChange={() => toggleTodo(id)}/>
                <span style={{ textDecoration: completed ? "line-through" : "none" }}>{content}</span>
              </Space>
            }
            description={
              <Space>
                
                <Space size="middle">Deadline: </Space>
                <div style={{ width: 108 }}>
                  <DatePicker size="small" defaultValue={deadline} inputReadOnly={true}/>
                </div>
                <div style={{ width: 92 }}>
                  <TimePicker
                    size="small"
                    use12Hours
                    format="h:mm a"
                    defaultValue={deadline}
                    inputReadOnly={true}
                  />
                </div>
                <Space>
                  <Button type="primary" danger shape="circle" size="small" onClick={() => removeTodo(id)}>
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
                  <Button type="primary" danger shape="circle" size="small" onClick={() => removeTodo(id)}>
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
