import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { ReviewForm } from '../ReviewForm';
import { theme } from '../../../../theme';

const movies = [
  {
    __typename: 'Movie',
    id: 'movie-1',
    title: 'Sample Movie',
    imgUrl: '',
    releaseDate: '2021-01-01',
    movieDirectorByMovieDirectorId: { __typename: 'MovieDirector', name: 'Director' },
    movieReviewsByMovieId: { __typename: 'MovieReviewsConnection', nodes: [] },
  },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ReviewForm', () => {
  it('shows validation cues when required fields are missing', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderWithTheme(
      <ReviewForm movies={movies as any} onSubmit={onSubmit} currentUserName='Ava' />
    );

    await user.click(screen.getByRole('button', { name: /submit review/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    const messages = await screen.findAllByText(/Title is required/i);
    expect(messages.length).toBeGreaterThan(0);
  });

  it('submits the form with provided values', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    renderWithTheme(
      <ReviewForm movies={movies as any} onSubmit={onSubmit} currentUserName='Ava' />
    );

    await user.type(screen.getByLabelText(/Review title/i), 'Great watch');
    await user.type(
      screen.getByLabelText(/What did you think\?/i),
      'Compelling and fun.'
    );
    await user.click(screen.getByLabelText(/Rating value/i));
    await user.click(screen.getByRole('option', { name: '4 Stars' }));

    await user.click(screen.getByRole('button', { name: /submit review/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      movieId: 'movie-1',
      title: 'Great watch',
      body: 'Compelling and fun.',
      rating: 4,
    });
  });
});
