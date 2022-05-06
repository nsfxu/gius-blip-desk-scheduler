import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import BuilderScheduler from '../BuilderScheduler';

describe('Builder scheduler', () => {
    it('should render correctly', () => {
        const builderPage = render(<BuilderScheduler />);

        expect(builderPage.getByTestId('teamContainer')).toBeInTheDocument();
        expect(builderPage.getByTestId('schedulerContainer')).toBeInTheDocument();
    });
});
