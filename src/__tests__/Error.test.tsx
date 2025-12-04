import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ErrorComponent from '@/app/error';

const resetMock = jest.fn();
const mockError = new Error('Test error message') as Error & { digest?: string };

describe('Error componenet', () => {
  it('should display something went wrong text ', async () => {
    render(<ErrorComponent error={mockError} reset={resetMock} />)

    await userEvent.click(screen.getByRole('button'));
    expect(resetMock).toHaveBeenCalled();

    expect(screen.getByRole('heading')).toHaveTextContent('Something went wrong!');
    expect(screen.getByRole('button')).toHaveTextContent('Try again');
    expect(screen.getByRole('button')).not.toBeDisabled();


  });

  it('should render without modifications', () => {
    const {container} = render(<ErrorComponent error={mockError} reset={resetMock} />)

    expect(container).toMatchSnapshot();
  })
})