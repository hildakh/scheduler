import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import { exportAllDeclaration } from "@babel/types";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  return waitForElement(() => getByText("Monday"))
  .then(() => { 
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
});
});
