import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  const interviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {

  return axios.put(`/api/appointments/${id}`, {interview})
    .then( (response) => {
      if(response) {
      const appointment = {
        ...state.appointments[id],
        interview: JSON.parse(response.config.data).interview
      };
      //updating the appointments object and adding the newly created appointment to the existing appointments object
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
    setState({...state, appointments})     
      }
    });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
    .then( (response) => {
      if(response) {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState({...state, appointments})
        console.log(appointments);
        console.log(state.appointments)
      }
    })
  }

  useEffect(() => {
    Promise.all([
      (axios.get("/api/days")),
      (axios.get("/api/appointments")),
      (axios.get("/api/interviewers"))
    ]).then(all => {
      setState(prev => ({
        ...state,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    console.log(interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        interviewers={interviewers}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Environment Setup" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
          days={state.days} 
          day={state.day} 
          setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
