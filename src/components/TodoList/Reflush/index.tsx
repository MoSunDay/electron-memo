import React, { FC, ReactElement, useState, useEffect } from "react";
import { Progress } from 'antd';

interface IProps {
  setLoading: (loading: boolean) => void;
}
const Reflush: FC<IProps> = ({
  setLoading,
}): ReactElement => {

  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const reFlush = (): number => {
    setLoading(true);
    sleep(250).then(() => {
      setLoading(false);
    });
    return 0;
  }

  const [count, setCount] = useState(0)
  const interval = 60
  useEffect(() => {
    const countTimer = setInterval(() => {
      setCount(c => {
          return c >= interval ? reFlush() : c + 1
      })
    }, 1000)
    return () => {
      clearInterval(countTimer)
    }
  }, [])

  const currentValue = Math.round(count / interval * 100) <= 100 ? Math.round(count / interval * 100) : 100
  return (
    <>
      <Progress percent={currentValue} status="active" />
    </>
  );
}

export default Reflush;
