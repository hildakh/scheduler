import React from "react";
import { render, cleanup, waitForElement, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";
import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

  //Test no. 1
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  return waitForElement(() => getByText("Monday"))
  .then(() => { 
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
})
  //Test no. 2
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointments")
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await waitForElement(()=> getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    // console.log(prettyDOM(appointment));
    // debug method > This method is a shortcut for console.log(prettyDOM(baseElement)).
    // debug();
  });

  //Test no. 3
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, "appointments").find(
    appointment => queryByText(appointment, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "How dare you?!")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
      // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  //Test no. 4
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    const { container } = render(<Application />);
    await waitForElement(()=> getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointments").find(
    appointment => queryByText(appointment, "Archie Cohen")); 

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Hilda Matilda"}
    });
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(()=> getByText(appointment, "Hilda Matilda"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    });
  
  //Test no. 5
  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointments")
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Melina"}});

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement( () => getByText(appointment, "Hmm... Can't save at the moment!"))
    expect(getByText(appointment, "Hmm... Can't save at the moment!")).toBeInTheDocument();
    });

  //Test no. 6
  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointments").find(
    appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "How dare you?!")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement( () => getByText(appointment, "Hahaha, you can't delete this interview!"));

    expect(getByText(appointment, "Hahaha, you can't delete this interview!")).toBeInTheDocument();
    // debug();
  });
  
});

