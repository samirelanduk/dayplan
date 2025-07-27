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

  const nowString = nowDt.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const chartOptions = {
    chart: {
      type: "line"
    },
    xAxis: {
      type: "datetime"
    },
    series: []
  };

  const onChange = (e, index, remainingWork) => {
    setRemainingWork(remainingWork.map((m, i) => i === index ? (parseInt(e.target.value) || 0) : m));
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">

      <div className="flex justify-between items-center">
        <div className="text-lg">{nowString}</div>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded" onClick={reset}>Reset</button>
      </div>

      <div className="flex mt-6">
        <div className="flex flex-col gap-2 border rounded-l p-3 w-fit">
          <label className="text-sm text-gray-600">Start</label>
          <input type="datetime-local" className="border rounded px-2 py-1" value={dtToString(periodDt[0])} onChange={(e) => setPeriod([e.target.value, period[1]])} />
        </div>
        <div className="flex flex-col gap-2 border border-l-0 rounded-r p-3 w-fit">
          <label className="text-sm text-gray-600">End</label>
          <input type="datetime-local" className="border rounded px-2 py-1" value={dtToString(periodDt[1])} onChange={(e) => setPeriod([period[0], e.target.value])} />
        </div>
      </div>

      <div className="mt-6 text-lg">
        {hoursRemaining} hour{hoursRemaining === 1 ?  "" : "s"}
        {minutesRemaining > 0 && ` ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}`}
        {" "}remaining
      </div>

      <div className="mt-8 text-lg">
        {totalRemainingWork >= 60 ? (
          <>
            {Math.floor(totalRemainingWork / 60)} hour{Math.floor(totalRemainingWork / 60) === 1 ? "" : "s"}
            {totalRemainingWork % 60 > 0 && ` and ${totalRemainingWork % 60} minute${totalRemainingWork % 60 === 1 ? "" : "s"}`}
          </>
        ) : (
          `${totalRemainingWork} minute${totalRemainingWork === 1 ? "" : "s"}`
        )} of work remaining
      </div>

      <div className="mt-8 text-lg">
        Need to do <span className="font-bold">{Math.ceil(workPerHour)}</span> minutes of work per hour
      </div>

      <div className="mt-8 border rounded flex w-fit items-center">
        {remainingWork.map((minutes, index) => (
          <div key={index} className="p-3 flex items-center gap-2">
            <button className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded" tabIndex={-1} onClick={() => setRemainingWork(remainingWork.filter((_, i) => i !== index))}>-</button>
            <DelayedInput
              type="number"
              className="border rounded w-16 px-2 py-1"
              value={minutes}
              step={5}
              onChange={(e, remainingWork) => onChange(e, index, remainingWork)}
            />
          </div>
        ))}
        <button className="px-3 hover:bg-gray-50" onClick={() => setRemainingWork([...remainingWork, 0])}>+</button>
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