import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import RouterScheduler from '../RouterScheduler';

describe('Router scheduler', () => {
    it('should render bot selector correctly', () => {
        const routerPage = render(<RouterScheduler />);

        expect(routerPage.getByTestId('botContainer')).toBeInTheDocument();
    });
});
