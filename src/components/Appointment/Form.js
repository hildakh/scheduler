import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";
import { statements } from "@babel/template";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const reset = () => {
    setName("");
    setError("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset()
    props.onCancel();
  }
  function validate() {
    if (name === "" || !interviewer) {
      setError("You must type in your name and select an interviewer.");
      return;
    }
    setError("");
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        {/* onSubmit event is added to prevent the default refresh and form submit behavior */}
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
            onCancel={props.onCancel}
            /*
          This must be a controlled component
        */
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          {/* Changed the props to onCancel as it was changed it in the index.js */}
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
