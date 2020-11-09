import { useState } from "react";

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);
  const [mode, setMode] = useState(initial);

  const transition = (mode, replace) => {
    //setMode to the current mode
    setMode(mode);
    //If there is need for replace
    if (replace) {
      //remove the last item in the array to replace it with the new mode
      setHistory((prev) => [...prev.slice(0, prev.length - 1), mode]);
    } else {
      //add the current mode to the history array
      //set the history
      setHistory((prev) => [...prev, mode]);
    }
  };

  function back() {
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
    }
  }
  return { mode, transition, back };
};

export default useVisualMode;
