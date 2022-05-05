import React from 'react';
import Paper from '../Paper';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Paper', () => {
    it('should render correctly', () => {
        render(
            <Paper
                elevation="primary"
                className="pa4 mt4"
                children={<h1>Paper Content</h1>}
            />
        );

        expect(
            screen.getByRole('heading', { name: /paper content/i })
        ).toBeInTheDocument();
    });

    it('should handle click event', () => {
        const handleClick = jest.fn();

        render(
            <Paper
                elevation="primary"
                className="pa4 mt4"
                children={
                    <button
                        data-testid="buttonHandleClick"
                        onClick={handleClick}
                    >
                        Paper button
                    </button>
                }
            />
        );

        expect(handleClick).toHaveBeenCalledTimes(0);

        const buttonNode = screen.queryByTestId('buttonHandleClick');
        fireEvent.click(buttonNode);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
