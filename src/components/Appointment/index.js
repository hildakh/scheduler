import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

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

function remove(){
    transition(DELETING)
    props.cancelInterview(props.id)
    .then (() =>  transition(EMPTY))   
  }

  return (
  <article className="appointment">
  <Header time={props.time}/>


  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && ( 
  <Show 
  student={props.interview.student}
  interviewer={props.interview.interviewer.name}
  onEdit={() => transition(EDIT)}
  onDelete={() => transition(CONFIRM)}
  />
  )}
  {mode === CREATE && 
  <Form onCancel={back} onSave={save} interviewers={props.interviewers}/>
  }
  {mode === SAVING && 
  <Status message="Saving"/>
  }
  {mode === DELETING &&
  <Status message="Deleting"/>
  }
  {mode === CONFIRM &&
  <Confirm onConfirm={remove} onCancel={ () => transition(SHOW)}/>
  }
  {mode === EDIT &&
  <Form onCancel={back} onSave={save} student={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer.id}
  />
  }
  </article>
  );
}

