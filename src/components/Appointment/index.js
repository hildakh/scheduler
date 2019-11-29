import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";

export default function Appointment(props) {

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING"

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
)

function save(name, interviewer) {
  const interview = {
    student: name, 
    interviewer
  };

  transition(SAVING)
  props.bookInterview(props.id, interview)
  .then(() =>  {
     transition(SHOW)
     })
}

  return (
  <article className="appointment">
  <Header time={props.time}/>


  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && ( 
  <Show 
  student={props.interview.student}
  interviewer={props.interview.interviewer.name}
  onEdit={}
  onDelete={}
  />
  )}
  {mode === CREATE && 
  <Form onCancel={back} onSave={save} interviewers={props.interviewers}/>
  }
  {mode === SAVING && 
  <Status message="Saving"/>
  }
  </article>
  );
}

