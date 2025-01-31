/// <reference types="cypress"/>

const URL = "http://127.0.0.1:5500/index.html";
describe("exchange house", () => {
    beforeEach(() => {
        cy.visit(URL);
    });
    it("frontpage can be opened", () => {
        cy.get("[data-cy='exchange-house-title']").should(
            "contain",
            "Casa de Cambio"
        );
    });
    it("exchange can change currency", () => {
        cy.get("[data-cy='currency-selected']")
            .should("contain", "Euro")
            .select("Australian Dollar")
            .should("contain", "Australian Dollar")
            .select("Brazilian Real")
            .should("contain", "Brazilian Real");
    });
    it("make sure it can calculate the rates", () => {
        let firstRate;
        cy.get("[data-cy='rates']")
            .first()
            .then(($value) => {
                firstRate = $value.text();
                console.log({ firstRate });
                cy.get("[data-cy='currency-selected']").select(
                    "Australian Dollar"
                );
                cy.get("[data-cy='calculate-btn']").click();
            })
            .then(() => {
                cy.get("[data-cy='rates']")
                    .first()
                    .should("have.not.text", firstRate)
                    .invoke("text")
                    .then(($secondRate) => {
                        console.log($secondRate);
                        expect($secondRate).not.to.eq(firstRate);
                    });
            });
    });
    it("make sure it can change amount of currency", () => {
        let firstAmount;
        cy.get("[data-cy='amount-currency']")
            .first()
            .invoke("text")
            .should("equal", "1")
            .then(($firstAmount) => {
                firstAmount = $firstAmount;
                cy.get("[data-cy='amount-input']").type(20);
                cy.get("[data-cy='calculate-btn']").click();
                cy.get("[data-cy='amount-currency']")
                    .first()
                    .should("have.not.text", firstAmount)
                    .invoke("text")
                    .then(($secondAmount) => {
                        expect($secondAmount).not.to.eq(firstAmount);
                    });
            });
    });
});
