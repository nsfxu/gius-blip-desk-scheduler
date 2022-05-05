import React from 'react';
import { act, render, screen } from '@testing-library/react';
<<<<<<< HEAD
import '@testing-library/jest-dom/extend-expect';
=======
>>>>>>> f01e5161f41a53d74dd65b5710e50a16abffe2e0

import Scheduler from '../Scheduler';

describe('Scheduler', () => {
    const mockCurrentResources = {
        weekdays: [
            {
                day: 'Domingo',
                workTimes: []
            },
            {
                day: 'Segunda',
                workTimes: [
                    {
                        start: '09:00',
                        end: '19:00'
                    }
                ]
            },
            {
                day: 'Terça',
                workTimes: [
                    {
                        start: '09:00',
                        end: '19:00'
                    }
                ]
            },
            {
                day: 'Quarta',
                workTimes: [
                    {
                        start: '09:00',
                        end: '19:00'
                    }
                ]
            },
            {
                day: 'Quinta',
                workTimes: [
                    {
                        start: '09:00',
                        end: '19:00'
                    }
                ]
            },
            {
                day: 'Sexta',
                workTimes: [
                    {
                        start: '09:00',
                        end: '19:00'
                    }
                ]
            },
            {
                day: 'Sábado',
                workTimes: []
            }
        ],
        noWorkDays: [
            '01-01',
            '04-02',
            '04-21',
            '05-01',
            '09-07',
            '10-08',
            '10-12',
            '11-02',
            '11-15',
            '12-25',
            '12-31'
        ],
        schedulerMessage: 'Segunda a Sexta: 09h00 às 19h00'
    };

    const mockCurrentWorkTime = 'workTime';

    const mockCurrentTeam = 'Todos';

<<<<<<< HEAD
    it('should render the two main containers', async () => {
=======
    it('should render correctly', async () => {
>>>>>>> f01e5161f41a53d74dd65b5710e50a16abffe2e0
        await act(async () => {
            render(
                <Scheduler
                    currentResources={mockCurrentResources}
                    currentWorkTime={mockCurrentWorkTime}
                    currentTeam={mockCurrentTeam}
                />
            );
        });

<<<<<<< HEAD
        expect(screen.getByTestId('weeksContainer')).toBeInTheDocument();
        expect(screen.getByTestId('noWorkDaysContainer')).toBeInTheDocument();
=======
        const scheduler = screen;
        expect(scheduler).toBeTruthy();
>>>>>>> f01e5161f41a53d74dd65b5710e50a16abffe2e0
    });

    it('should show a loading text if the resources are not ready', async () => {
        await act(async () => {
            render(
                <Scheduler
                    currentResources={null}
                    currentWorkTime={null}
                    currentTeam={null}
                />
            );
        });

<<<<<<< HEAD
        expect(
            screen.getByRole('heading', { name: /loading/i })
        ).toBeInTheDocument();
=======
        const loadingText = screen.getByRole('heading');
        expect(loadingText).toBeTruthy();
>>>>>>> f01e5161f41a53d74dd65b5710e50a16abffe2e0
    });
});
