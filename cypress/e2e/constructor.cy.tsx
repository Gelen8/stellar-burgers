describe('тесты страницы конструктора бургера', () => {

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });
  
  it('ингредиенты отображаются на странице', () => {
    cy.get('[data-cy="ingredient-item"]').should('have.length.greaterThan', 0);
  });

  describe('тесты модального окна детальной информиации ингредиента', () => {
    it('детальная информация конкретного ингредиента отображается в модальном окне', () => {
      cy.get('[data-id="1"]').click();
      cy.url().should('include', '/ingredients/1');
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="ingredient-data"]').contains('Краторная булка N-200i');
    });

    it('модальное окно закрывается по клику на кнопку', () => {
      cy.get('[data-id="1"]').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="button-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('модальное окно закрывается по клику на оверлэй', () => {
      cy.get('[data-id="1"]').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('тесты добавления ингредиента из списка в конструктор', () => {
    it('при клике на кнопку "Добавить" булка добавляется в конструктор сверху и снизу', () => {
      cy.get('[data-id="1"]').find('button').contains('Добавить').click();
      cy.get('[data-cy="constructor-bun-top"]').should('exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    });

    it('при клике на кнопку "Добавить" начинка добавляется в конструктор', () => {
      cy.get('[data-id="2"]').find('button').contains('Добавить').click();
      cy.get('[data-cy="constructor-filling"]').should('exist');
      cy.get('[data-cy="constructor-filling"]').should('have.length.greaterThan', 0);
    });
  });

  describe('тесты создания заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', 'api/auth/login', { fixture: 'userData.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'orderData.json' });
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.clearLocalStorage('refreshToken');
    });

    it('добавление ингредиентов в конструктор', () => {
      cy.get('[data-id="1"]').find('button').contains('Добавить').click();
      cy.get('[data-id="2"]').find('button').contains('Добавить').click();
      cy.get('[data-cy="button-order"]').should('not.be.disabled');
    });

    it('отображение модального окна с верным номером заказа при клике на кнопку "Оформить заказ"', () => {
      cy.get('[data-id="1"]').find('button').contains('Добавить').click();
      cy.get('[data-id="2"]').find('button').contains('Добавить').click();
      cy.get('[data-cy="button-order"]').click();
      cy.url().should('include', '/login');
      cy.get('[data-cy="input-email"]').type('testUser@yandex.ru');
      cy.get('[data-cy="input-password"]').type('qwerty');
      cy.get('[data-cy="button-submit"]').click();
      cy.getCookie('accessToken').should('have.property', 'value', 'test');
      cy.getAllLocalStorage().then((result) => {
        expect(result).to.deep.equal({
          'http://localhost:4000': {
            'refreshToken': 'test',
          },
        });
      });
      cy.get('[data-cy="button-order"]').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="order-number"]').contains('85082');
    });

    it('очистка конструктора бургера после оформления заказа', () => {
      cy.get('[data-id="1"]').find('button').contains('Добавить').click();
      cy.get('[data-id="2"]').find('button').contains('Добавить').click();
      cy.get('[data-cy="button-order"]').click();
      cy.get('[data-cy="input-email"]').type('testUser@yandex.ru');
      cy.get('[data-cy="input-password"]').type('qwerty');
      cy.get('[data-cy="button-submit"]').click();
      cy.get('[data-cy="button-order"]').click();
      cy.get('[data-cy="button-close"]').click();
      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-cy="constructor-filling"]').should('not.exist');
    });
  });
});