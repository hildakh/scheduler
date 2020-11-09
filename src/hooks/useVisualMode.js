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
      setHistory((history) => [...history.slice(0, history.length - 1), mode]);
    } else {
      //add the current mode to the history array
      //set the history
      setHistory((history) => [...history, mode]);
    }
  };

  function back() {
    setMode(history[history.length - 2]);
    if (history.length > 1) {
      setHistory((history) => [...history.slice(0, history.length - 1)]);
    }
  }
  return { mode, transition, back };
};

export default useVisualMode;
