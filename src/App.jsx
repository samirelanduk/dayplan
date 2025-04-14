import { useState, useEffect } from "react";

const App = () => {

  
  const [now, setNow] = useState(new Date());
  const [end, setEnd] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0));
  const [remainingWork, setRemainingWork] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dtToString = dt => {
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    const hour = dt.getHours().toString().padStart(2, "0");
    const minute = dt.getMinutes().toString().padStart(2, "0");
    const second = dt.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  const endString = dtToString(end);
  const secondsRemaining = Math.round((end.getTime() - now.getTime()) / 1000);
  const hoursRemaining = Math.floor(secondsRemaining / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);
  const workPerHour = remainingWork / (secondsRemaining / 3600);

  return (
    <div className="p-2">
      <div>{now.toLocaleString()}</div>


      <div className="flex flex-col mt-8">
        <label className="text-xs">End of day</label>
        <input
          type="datetime-local"
          value={endString}
          onChange={(e) => setEnd(new Date(e.target.value))}
        />
        <div className="text-sm">
          {hoursRemaining} hour{hoursRemaining === 1 ? "" : "s"} {minutesRemaining} minute{minutesRemaining === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-8">
        <input
          type="number"
          className="w-12 text-right"
          value={remainingWork}
          onChange={(e) => setRemainingWork(e.target.value)}
        />
        <label>Minutes remaining</label>
        <div>
          {workPerHour}
        </div>
      </div>
      

    </div>
  )
}

  
  /* const [remainingMinutes, setRemainingMinutes] = useState(0);

  const todayAtTen = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0);

  const secondsRemaining = Math.round((todayAtTen.getTime() - now.getTime()) / 1000);

   */

  /* return (
    <div>
      <div className="flex flex-col gap-1 border p-2 w-fit">
        <label>End of day</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <label>Remaining minutes</label>
        <div>{secondsRemaining}</div>
      </div>
      <div className="flex flex-col gap-1 border p-2 w-fit">
        <label>Remaining minutes</label>
        <input
          type="number"
          value={remainingMinutes}
          onChange={(e) => setRemainingMinutes(e.target.value)}
        />
      </div>
    </div>
  ); */

App.propTypes = {
  
};

export default App;