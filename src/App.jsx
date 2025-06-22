import { useEffect } from "react";
import { useLocalStorageState } from "./hooks";
import DelayedInput from "./DelayedInput";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const App = () => {

  const current = new Date();
  const [now, setNow] = useLocalStorageState("now", current.toISOString());

  const [period, setPeriod] = useLocalStorageState("period", [
    new Date(current.getFullYear(), current.getMonth(), current.getDate() + (current.getHours() > 21 ? 1 : 0), 10, 0, 0, 0).toISOString(),
    new Date(current.getFullYear(), current.getMonth(), current.getDate() + (current.getHours() > 21 ? 1 : 0), 22, 0, 0, 0).toISOString(),
  ]);

  const [remainingWork, setRemainingWork] = useLocalStorageState("remainingWork", [0]);

  const nowDt = new Date(now);
  const periodDt = period.map(dt => new Date(dt));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, [setNow]);

  const dtToString = dt => {
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    const hour = dt.getHours().toString().padStart(2, "0");
    const minute = dt.getMinutes().toString().padStart(2, "0");
    const second = dt.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  const reset = () => {
    setNow(current.toISOString());
    setPeriod([
      new Date(current.getFullYear(), current.getMonth(), current.getDate() + (current.getHours() > 21 ? 1 : 0), 10, 0, 0, 0).toISOString(),
      new Date(current.getFullYear(), current.getMonth(), current.getDate() + (current.getHours() > 21 ? 1 : 0), 22, 0, 0, 0).toISOString(),
    ]);
    setRemainingWork([0]);
  }

  const startToUse = periodDt[0] > nowDt ? periodDt[0] : nowDt;
  const secondsRemaining = Math.round((periodDt[1].getTime() - startToUse.getTime()) / 1000);
  const hoursRemaining = Math.floor(secondsRemaining / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);

  const totalRemainingWork = remainingWork.reduce((acc, curr) => acc + curr, 0);
  const workPerHour = totalRemainingWork / (secondsRemaining / 3600);

  const chartOptions = {
    chart: {
      type: "line"
    },
    xAxis: {
      type: "datetime"
    },
    series: []
  };

  return (
    <div className="p-2">

      <div className="flex justify-between">
        <div>{nowDt.toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}</div>
        <button onClick={reset}>Reset</button>
      </div>

      <div className="flex mt-4">
        <div className="flex flex-col gap-1 border p-2 w-fit">
          <label>Start</label>
          <input type="datetime-local" value={dtToString(periodDt[0])} onChange={(e) => setPeriod([e.target.value, period[1]])} />
        </div>
        <div className="flex flex-col gap-1 border border-l-0 p-2 w-fit">
          <label>End</label>
          <input type="datetime-local" value={dtToString(periodDt[1])} onChange={(e) => setPeriod([period[0], e.target.value])} />
        </div>
      </div>

      <div className="mt-4">
        {hoursRemaining} hour{hoursRemaining === 1 ?  "" : "s"}
        {minutesRemaining > 0 && ` ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}`}
        {" "}remaining
      </div>

      <div className="mt-8">
        {totalRemainingWork >= 60 ? (
          <>
            {Math.floor(totalRemainingWork / 60)} hour{Math.floor(totalRemainingWork / 60) === 1 ? "" : "s"}
            {totalRemainingWork % 60 > 0 && ` and ${totalRemainingWork % 60} minute${totalRemainingWork % 60 === 1 ? "" : "s"}`}
          </>
        ) : (
          `${totalRemainingWork} minute${totalRemainingWork === 1 ? "" : "s"}`
        )} of work remaining
      </div>

      <div className="mt-8">
        Need to do <span className="font-bold">{Math.ceil(workPerHour)}</span> minutes of work per hour
      </div>


      <div className="mt-8 border flex w-fit pr-2">
        {remainingWork.map((minutes, index) => (
          <div key={index} className="p-2">
            <button tabIndex={-1} onClick={() => setRemainingWork(remainingWork.filter((_, i) => i !== index))}>-</button>
            <DelayedInput
              type="number"
              className="border"
              value={minutes}
              onChange={(e) => setRemainingWork(remainingWork.map((m, i) => i === index ? (parseInt(e.target.value) || 0) : m))}
            />
          </div>
        ))}
        <button onClick={() => setRemainingWork([...remainingWork, 0])}>+</button>
      </div>

      <div className="mt-8">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>

    </div>
  )
}

App.propTypes = {
  
};

export default App;