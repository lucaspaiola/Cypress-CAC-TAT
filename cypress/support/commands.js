Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(nome, sobrenome, email, textoAjuda) {
    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(textoAjuda)
    cy.contains('.button', 'Enviar').click()
})