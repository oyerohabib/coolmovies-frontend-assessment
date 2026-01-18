import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MovieCard } from '../MovieCard';
import { theme } from '../../../../theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const movie = {
  __typename: 'Movie',
  id: 'movie-1',
  title: 'Sample Movie',
  imgUrl: 'https://placehold.co/64x64',
  releaseDate: '2021-01-01',
  movieDirectorByMovieDirectorId: { __typename: 'MovieDirector', name: 'Director' },
  movieReviewsByMovieId: {
    __typename: 'MovieReviewsConnection',
    nodes: [
      {
        __typename: 'MovieReview',
        id: 'review-1',
        title: 'Great!',
        body: 'Loved it',
        rating: 4,
        userByUserReviewerId: {
          __typename: 'User',
          id: 'user-1',
          name: 'Ava',
        },
      },
    ],
  },
};

describe('MovieCard', () => {
  it('renders movie details and reviews', () => {
    renderWithTheme(<MovieCard movie={movie as any} />);

    expect(screen.getByText(/Sample Movie/)).toBeInTheDocument();
    expect(screen.getByText(/Director/)).toBeInTheDocument();
    expect(screen.getByText(/Great!/)).toBeInTheDocument();
    expect(screen.getByText(/4 \/ 5/)).toBeInTheDocument();
  });
});
