const URL = "http://127.0.0.1:5500/index.html";
describe("exchange house", () => {
    it("frontpage can be opened", () => {
        cy.visit(URL);
        cy.get("[data-cy='exchange-house-title']").should(
            "contain",
            "Casa de Cambio"
        );
    });
    it("exchange can change currency", () => {
        cy.visit(URL);
        cy.get("[data-cy='currency-selected']")
            .should("contain", "Euro")
            .select("Australian Dollar")
            .should("contain", "Australian Dollar")
            .select("Brazilian Real")
            .should("contain", "Brazilian Real");
    });
    it("make sure it can calculate the rates", () => {
        cy.visit(URL);
        const FIRST_RATE = cy.get("[data-cy='rates']").first();
        cy.get("[data-cy='currency-selected']").select("Australian Dollar");
        cy.get("[data-cy='calculate-btn']").click();
        cy.get("[data-cy='rates']").first().should("not.equal", FIRST_RATE);
    });
});
