export function getAppointmentsForDay(state, day) {
  let result = [];
  const filteredDay = state.days.filter(d => d.name === day);
  if (filteredDay.length) {
    const dayAppointments = filteredDay[0].appointments;
    dayAppointments.forEach(app => {
      if (app === state.appointments[app].id) {
        result.push(state.appointments[app]);
      }
    });
  }
  return result;
}

export function getInterview(state, interview) {
  let interviewInfo = null;
  if (interview) {
    interviewInfo = {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    };
  }
  return interviewInfo;
}

export function getInterviewersForDay(state, day) {
  let result = [];
  const filteredDay = state.days.filter(d => d.name === day);
  if (filteredDay.length) {
    const dayInterviewers = filteredDay[0].interviewers;
    dayInterviewers.forEach(app => {
      if (app === state.interviewers[app].id) {
        result.push(state.interviewers[app]);
      }
    });
  }
  return result;
}