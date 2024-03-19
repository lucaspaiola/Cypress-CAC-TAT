// Utilizacao do lowdash para executar o mesmo teste 5 vezes, testando sua confiabilidade
Cypress._.times(5, function() {
    it('testa a página da política de privacidade de forma independente', function() {
        cy.visit('./src/privacy.html')
    
        cy.contains('Talking About Test').should('be.visible')
    })
})