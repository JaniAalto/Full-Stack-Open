describe("Blog app", function () {
  beforeEach(function () {  // reset database
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const user2 = {
      name: 'Test User 2',
      username: 'testuser2',
      password: 'moresecret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)

    cy.visit('http://localhost:3000')
  })
  /*
    it('Login form is shown', function () {
      cy.contains('Login')
    })*/

  describe("Login", function () {
    it('succeeds with correct credentials', function () {
      cy.contains('Login').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Current user: Test User')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Login').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe.only("When logged in", function () {
    beforeEach(function () {  // login
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser', password: 'secret'
      }).then(response => {
        localStorage.setItem('loggedInUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it("A blog can be created", function () {
      cy.contains('Create new').click()
      cy.get('#title').type('Blog Title')
      cy.get('#author').type('Blog Author')
      cy.get('#url').type('https://some.blog.com')
      cy.get('#submit-button').click()

      cy.contains('Blog Title by Blog Author')
    })

    describe("When a blog has been created", function () {
      beforeEach(function () {  // create one blog
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: { 'title': 'Blog Title', 'author': 'Blog Author', 'url': 'https://some.blog.com' },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')
      })

      it("A blog can be liked", function () {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('1 likes')
      })

      it("A blog can be deleted", function () {
        cy.contains('view').click()
        cy.contains('delete').click()

        cy.get('html').should('not.contain', 'Blog Title by Blog Author')
      })

      it.only("Only the authorised user can see a blog's delete button", function () {
        cy.contains('Logout').click()

        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'testuser2', password: 'moresecret'
        }).then(response => {
          localStorage.setItem('loggedInUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })

        cy.contains('Current user: Test User 2')

        cy.contains('view').click()
        cy.contains('delete').should('not.be.visible')
      })
    })

    describe.only("When multiple blogs have been created", function () {
      beforeEach(function () {  // create three blogs
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            'title': 'Blog Title', 'author': 'Blog Author',
            'url': 'https://some.blog.com', 'likes': 2
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            'title': 'Blog Title 2', 'author': 'Another',
            'url': 'https://another.blog.com', 'likes': 4
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            'title': 'Blog Title 3', 'author': 'Blog Author',
            'url': 'https://third.blog.com', 'likes': 3
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`}
        })
        cy.visit('http://localhost:3000')
      })

      it("Blogs are arranged by number of likes", function () {
        cy.get('.blog').eq(0).should('contain', 'Blog Title 2')
        cy.get('.blog').eq(1).should('contain', 'Blog Title 3')
        cy.get('.blog').eq(2).should('contain', 'Blog Title')

        cy.get('.blog').eq(2).contains('view').click()
        cy.get('.blog').eq(2).contains('like').click()
        cy.get('.blog').eq(1).contains('Blog Title')
        cy.get('.blog').eq(1).contains('like').click()

        cy.get('.blog').eq(0).should('contain', 'Blog Title')
        cy.get('.blog').eq(1).should('contain', 'Blog Title 2')
        cy.get('.blog').eq(2).should('contain', 'Blog Title 3')
      })
    })
  })
})