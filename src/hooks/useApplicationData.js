import { useReducer, useEffect } from "react";
import axios from "axios";
// import { actions } from "@storybook/addon-actions/dist/preview";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function getSpotsRemainingForDay(day, appointments) {
  const spotsForThisDay = day.appointments;
  let freeSpots = 0;
  spotsForThisDay.forEach(appId => {
    if (!appointments[appId].interview) {
      freeSpots++;
    }
  });
  return freeSpots;
}

function decorateDaysWithSpots(days, appointments) {
  // return array of decorated days
  const decoratedDays = days.map(day => ({
    ...day,
    spots: getSpotsRemainingForDay(day, appointments)
  }));
  return decoratedDays;
}

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.day };
  }

  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers
    };
  }

  if (action.type === SET_INTERVIEW) {
    const appointment = {
      //adding interview data to the already existing appoitnment in the appointments object
      ...state.appointments[action.id],
      interview: action.interview
    };

    const appointments = {
      ...state.appointments,
      [action.id]: appointment
    };

    const days = decorateDaysWithSpots(state.days, appointments);
    return {
      ...state,
      appointments: appointments,
      days: days
    };
  }
  
  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

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
