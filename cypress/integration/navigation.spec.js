describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });
  it("should navigate to Tuesday", () => {
    cy.visit("/");
    //using contain for click works fine as we select the whole container 
    cy.contains("li", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected");
  });
})