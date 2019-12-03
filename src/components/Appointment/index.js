import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
)

function save(name, interviewer) {
  const interview = {
    student: name, 
    interviewer
  };

  transition(SAVING, true)
  props.bookInterview(props.id, interview)
  .then(() =>  {
     transition(SHOW)
     })
  .catch(() => transition(ERROR_SAVE, true)) 
}

function remove(){
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then (() =>  transition(EMPTY)) 
    .catch( () => transition(ERROR_DELETE, true))
  }

  return (
  <article 
  className="appointment"
  data-testid="appointment"
  >
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
  <Form onCancel={back} onSave={save} name={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer.id}
  />
  }
  {mode === ERROR_DELETE &&
  <Error message="Hahaha, you can't delete this interview!" onClose={ () => transition(SHOW)}
  />
  }
  {mode === ERROR_SAVE &&
  <Error message="Hmm... Can't save at the moment!" onClose={ () => transition(SHOW)}
  />
  }
  </article>
  );
}

