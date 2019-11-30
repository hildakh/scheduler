import React, { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  if (action.type = "SET_DAY") {
    return {...state, day: action.day}
  }

  if (action.type = "SET_APPLICATION_DATA") {
    return {
      ...state, 
      days: action.days, 
      appointments: action.appointments,
      interviewers: action.interviewers}
  }

  if (action.type = "SET_INTERVIEW") {
      const appointment = {
      ...state.appointments[action.id],
      interview: action.interview
      }

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
  }

  throw new Error (
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
         
          dispatch({ type: SET_APPLICATION_DATA, appointments });
        }
      });
  };

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(response => {
      if (response) {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        dispatch({ type: SET_INTERVIEW, interviewers });
      }
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      dispatch(prev => ({
        ...state,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);
  return { state, setDay, bookInterview, cancelInterview };
}
