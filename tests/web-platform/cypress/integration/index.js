describe('css/cssom-view', () => {
  // @TODO maybe there is a dynamic way to generate a list over tests

  const tests = [
    'scrollintoview.html',
    'scrollIntoView-smooth.html',
    //'scrollIntoView-shadow.html',
  ]
  tests.forEach((test) => {
    it(`implements ${test} correctly`, () => {
      cy.visit(`/css/cssom-view/${test}`)

      cy.get('#summary .pass', { timeout: 10000 }).should('exist')
      cy.get('#summary .fail').should('not.exist')
    })
  })
})

describe('custom', () => {
  const tests = ['borders.html']
  tests.forEach((test) => {
    it(`implements ${test} correctly`, () => {
      cy.visit(`/custom/${test}`)

      cy.get('#summary .pass').should('exist')
      cy.get('#summary .fail').should('not.exist')
    })
  })
})
