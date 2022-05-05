import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import Home from '../Home';

describe('Home page', () => {
    it('should render correctly', () => {
        const history = createMemoryHistory();

        const homePage = render(
            <Router history={history}>
                <Home />
            </Router>
        );

        expect(homePage).toMatchSnapshot();
        expect(history.location.pathname).toBe('/');
    });
});
