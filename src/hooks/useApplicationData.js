import { useReducer, useEffect } from "react";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";
import axios from "axios";
// import { actions } from "@storybook/addon-actions/dist/preview";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  const bookInterview = function(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        if (response) {
          //updating the appointments object and adding the newly created appointment to the existing appointments object
          dispatch({ type: SET_INTERVIEW, id, interview });
        }
      });
  };

 function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(response => {
      if (response) {
        dispatch({ type: SET_INTERVIEW, id, interview: null});
      }
    });
  }
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers
      });
    });
  }, []);
  return { state, setDay, bookInterview, cancelInterview };
}
