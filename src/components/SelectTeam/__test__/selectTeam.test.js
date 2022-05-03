import React from 'react';
import '@testing-library/jest-dom';
import SelectTeam from '..';

describe('Select team input', () => {
    let rtlContainer;

    beforeEach(() => {
        const { container } = render(
            <SelectTeam parentCallback={jest.fn()} allTeams={null} />
        );
        rtlContainer = container;
    });

    it('should have atleast one option if allTeams is null', () => {
        const teamSelector = screen.queryByTestId('teamSelector');
        expect(teamSelector).toHaveValue();
    });
});
