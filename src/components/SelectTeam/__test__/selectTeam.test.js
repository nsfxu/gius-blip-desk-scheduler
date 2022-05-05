import React from 'react';
import '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SelectTeam from '../SelectTeam';

describe('Select team', () => {
    const mockAllTeams = {
        total: 2,
        itemType: 'application/vnd.iris.desk.team+json',
        items: [
            {
                name: 'Default',
                agentsOnline: 0
            },
            {
                name: 'RH',
                agentsOnline: 0
            }
        ]
    };

    it('should render correctly', () => {
        render(
            <SelectTeam parentCallback={jest.fn()} allTeams={mockAllTeams} />
        );

        const selector = screen.getByTestId('teamSelector');
        expect(selector).toBeTruthy();
    });

    it('should call parentCallback with Todos as a parameters', async () => {
        const parentCallback = jest.fn();
        render(
            <SelectTeam
                parentCallback={parentCallback}
                allTeams={mockAllTeams}
            />
        );

        const selector = screen.getByTestId('teamSelector');

        expect(selector).toBeDefined();
        expect(selector).not.toBeNull();
        expect(parentCallback).toHaveBeenCalledTimes(1);

        // Select the first option of the team selector
        fireEvent.keyDown(selector.firstChild, { key: 'ArrowDown' });
        await waitFor(() => screen.getByText('Todas as equipes'));
        fireEvent.click(screen.getByText('Todas as equipes'));

        expect(parentCallback).toHaveBeenCalledTimes(2);
        expect(parentCallback).toHaveBeenCalledWith('Todos');
    });
});
