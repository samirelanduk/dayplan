import { useState } from "react";

const App = () => {

  const todayAtTen = `${new Date().toISOString().slice(0, 10)}T22:00`;
  
  const [target, setTarget] = useState(todayAtTen);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  return (
    <div>
      <div className="flex flex-col gap-1 border p-2 w-fit">
        <label>End of day</label>
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
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
  );
};

App.propTypes = {
  
};

export default App;