import { useEffect, useState } from "react";
import moment from "moment";

export function useNow(stepMs: number = 1000): moment.Moment {
  const [now, setNow] = useState<moment.Moment>(() => moment());
  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), stepMs);
    return () => clearInterval(timer);
  }, [stepMs]);
  return now;
}
