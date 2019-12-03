import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

xit("defaults to Monday and changes the schedule when a new day is selected", () => {
  render(<Application />);
});
