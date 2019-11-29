import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const reset = () => {
    setName("")
    setInterviewer(null);
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
            value={props.student}
            onChange={(event) => setName(event.target.value)}
            /*
          This must be a controlled component
        */
          />
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
          <Button danger onClick={props.onCancel}>
            Cancel
          </Button>
          <Button confirm onClick={() => props.onSave(name, interviewer)}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
