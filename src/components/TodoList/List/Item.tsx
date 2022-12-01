import { FC, ReactElement } from "react";
import { Space, Checkbox, Button, List } from "antd";
import { DatePicker, TimePicker } from "antd";
import { ITodo } from "../typings";
import moment from "moment";
import "./list.css";

import { SortableElement } from 'react-sortable-hoc';

interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  index: number;
  key: string;
}

const TdItem: FC<IProps> = ({ todo, removeTodo, toggleTodo, key, index }): ReactElement => {
  const { id, content, completed, deadline } = todo;
  const deadlineTimestamp = deadline.format();
  const nowTimestamp = moment().format();
  const SortableItem = SortableElement(() => <span>
  <List.Item>
    {
      !deadlineTimestamp.startsWith("19") ?
        <List.Item.Meta
          title={
            <Space>
              <Checkbox checked={completed} onChange={() => toggleTodo(id)}/>
                  <div
                    style={{ width: 270, textDecoration: completed ? "line-through" : "none" , color: !completed && nowTimestamp > deadlineTimestamp ? "red" : "black" }}
                  >
                    {content}
                  </div>
            </Space>
          }
          description={
            <Space>
              <Space size="middle">Deadline: </Space>
              <div style={{ width: 118 }}>
                <DatePicker size="small" defaultValue={deadline} disabled/>
              </div>
              <div style={{ width: 102 }}>
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
            <Space size="small">
              <Checkbox checked={completed} onChange={() => toggleTodo(id)}/>
              <div style={{textDecoration: completed ? "line-through" : "none", width: 270 }}>{content}</div>
                <Button shape="circle" size="small" onClick={() => removeTodo(id)}>
                  -
                </Button>
            </Space>
          }
        />
    }
  </List.Item>
  </span>);
  return <SortableItem key={key} index={index}/>;
};

export default TdItem;
