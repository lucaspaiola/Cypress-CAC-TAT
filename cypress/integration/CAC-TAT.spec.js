/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function() {
    cy.title().should('be.equals', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function() {
    const longText = 'Teste, testes, teste, teste, teste, testes, teste, teste, teste, testes, teste, teste, teste, testes, teste, teste, teste, testes, teste, teste, teste, testes, teste, teste, teste, testes, teste, teste, teste'
    
    cy.clock()
    
    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Paiola')
    cy.get('#email').type('email@exemplo.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('.button', 'Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000) // avanca 3 segundos no navegador para nao perder tempo na execucao
    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.clock()
    
    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Paiola')
    cy.get('#email').type('email@exemplocom')
    cy.get('#open-text-area').type('Teste')
    cy.contains('.button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('verifica se telefone continua vazio após inserir caracteres não numéricos', function() {
    cy.get('#phone')
        .type('rrr')
        .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock()

    cy.get('#firstName').type('Lucas')
    cy.get('#lastName').type('Paiola')
    cy.get('#email').type('email@exemplo.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.contains('.button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
    cy.get('#firstName')
        .type('Lucas')
        .should('have.value', 'Lucas')
        .clear()
        .should('have.value', '')

    cy.get('#lastName')
        .type('Paiola')
        .should('have.value', 'Paiola')
        .clear()
        .should('have.value', '')

    cy.get('#email')
        .type('email@exemplo.com')
        .should('have.value', 'email@exemplo.com')
        .clear()
        .should('have.value', '')

    cy.get('#phone')
        .type('11999998888')
        .should('have.value', '11999998888')
        .clear()
        .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
    cy.clock()
    cy.contains('.button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', function() {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit('Lucas', 'Paiola', 'exemplo@email.com', 'Teste')

    cy.get('.success').should('be.visible')

    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  // selecionando opções em campos de seleção suspensa

  it('seleciona um produto (YouTube) por seu texto', function() {
    cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', function() {
    cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', function() {
    cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
  })

  // marcando inputs do tipo radio

  it('marca o tipo de atendimento "Feedback"', function() {
    cy.get('input[type="radio"]')
        .check('feedback')
        .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', function() {
    cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
  })

  // marcando e desmarcando inputs do tipo checkbox

  it('marca ambos checkboxes, depois desmarca o último', function() {
    cy.get('input[type="checkbox"')
        .check() // marca todos os checkbox
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
  })

  // fazendo upload de arquivos

  it('seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
  })

  it('seleciona um arquivo simulando um drag-and-drop', function() {
    cy.get('input[type="file"')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"')
        .selectFile('@sampleFile')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
  })

  // lidando com links que abrem em outra aba

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
    cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

    cy.contains('Talking About Testing').should('be.visible')
  })

  // Utilizacao do .invoke
  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it.only('preenche campo de texto utilizando .invoke()', function() {
    let texto = Cypress._.repeat('1234567890', 20)

    cy.get('#open-text-area')
      .invoke('val', texto)
      .should('have.value', texto)
  })

})

