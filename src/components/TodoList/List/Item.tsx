import { FC, ReactElement } from "react";
import { Space, Checkbox, Button, List } from "antd";
import { DatePicker, TimePicker } from "antd";
import { ITodo } from "../typings";
import moment from "moment";
import "./list.css";

import { SortableElement } from 'react-sortable-hoc';
import { useNow } from "../../../hooks/useNow";

interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  index: number;
  key: string;
}

interface IContentProps {
  content: string;
  completed: boolean;
  deadline: moment.Moment;
}

const TodoContent: FC<IContentProps> = ({ content, completed, deadline }): ReactElement => {
  const now = useNow();
  const hasDeadline = deadline.year() > 1970; // 1970 为"无截止日期"占位值
  const overdue = hasDeadline && !completed && now.isAfter(deadline);
  return (
    <div
      style={{
        flex: 1,
        minWidth: 1,
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
        textDecoration: completed ? "line-through" : "none",
        color: overdue ? "red" : "black",
      }}
    >
      {content}
    </div>
  );
};

const TdItem: FC<IProps> = ({ todo, removeTodo, toggleTodo, key, index }): ReactElement => {
  const { id, content, completed, deadline } = todo;
  const deadlineTimestamp = deadline.format();
  const SortableItem = SortableElement(() => <span>
  <List.Item>
    {
      !deadlineTimestamp.startsWith("19") ?
        <List.Item.Meta
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Checkbox checked={completed} onChange={() => toggleTodo(id)} />
              <TodoContent content={content} completed={completed} deadline={deadline} />
            </div>
          }
          description={
            <Space>
              <Space size="middle">Deadline: </Space>
              <div style={{ width: 118 }}>
                <DatePicker size="small" value={deadline} disabled/>
              </div>
              <div style={{ width: 102 }}>
                <TimePicker
                  size="small"
                  use12Hours
                  format="h:mm a"
                  value={deadline}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Checkbox checked={completed} onChange={() => toggleTodo(id)} />
              <TodoContent content={content} completed={completed} deadline={deadline} />
              <Button shape="circle" size="small" onClick={() => removeTodo(id)}>
                -
              </Button>
            </div>
          }
        />
    }
  </List.Item>
  </span>);
  return <SortableItem key={key} index={index}/>;
};

export default TdItem;
