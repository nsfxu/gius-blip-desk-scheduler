import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import Home from '../Home';

describe('Home page', () => {
    it('should render correctly', () => {
        render(<Home />);

        const homePage = screen;
        expect(homePage).toBeTruthy();
    });
});
