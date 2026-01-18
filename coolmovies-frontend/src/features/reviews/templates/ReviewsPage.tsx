import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  useCreateMovieReviewMutation,
  useMoviesWithReviewsQuery,
} from '../../../generated/graphql';
import { MovieCard } from '../components/MovieCard';
import { ReviewForm } from '../components/ReviewForm';

export const ReviewsPage = () => {
  const { data, loading, error, refetch } = useMoviesWithReviewsQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [createReview, { loading: submitting }] = useCreateMovieReviewMutation();
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const [selectedMovie, setSelectedMovie] = useState<string>();

  const movies = useMemo(() => {
    const nodes = data?.allMovies?.nodes ?? [];
    return nodes.filter(
      (movie): movie is NonNullable<typeof nodes[number]> => Boolean(movie)
    );
  }, [data?.allMovies?.nodes]);

  const currentUser = data?.currentUser;

  const handleSubmit = async ({
    movieId,
    title,
    body,
    rating,
  }: {
    movieId: string;
    title: string;
    body: string;
    rating: number;
  }) => {
    if (!currentUser?.id) {
      setFormError('Please ensure you are signed in before adding a review.');
      return;
    }
    try {
      setFormError(undefined);
      setFormSuccess(undefined);
      await createReview({
        variables: {
          input: {
            movieReview: {
              movieId,
              title,
              body,
              rating,
              userReviewerId: currentUser.id as string,
            },
          },
        },
      });
      setFormSuccess('Review added successfully.');
      setSelectedMovie(movieId);
      await refetch();
    } catch (err) {
      setFormSuccess(undefined);
      setFormError('Could not submit review. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f4faf9 0%, #eff3fb 100%)',
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth='lg'>
        <Stack spacing={4}>
          <Stack spacing={1} textAlign='center'>
            <Typography variant='h3' component='h1'>
              Coolmovies Reviews
            </Typography>
            <Typography variant='subtitle1'>
              Browse what others think and add your own rating to the mix.
            </Typography>
          </Stack>

          {error ? (
            <Alert severity='error'>
              {`We couldn't load reviews. ${error.message}`}
            </Alert>
          ) : null}

          {loading ? (
            <Stack alignItems='center' py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={3} alignItems='flex-start'>
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={2}>
                  {movies.map((movie) => (
                    <Grid size={{ xs: 12, md: 6 }} key={movie?.id as string}>
                      {movie ? (
                        <MovieCard
                          movie={movie}
                          onAddReview={(movieId) => setSelectedMovie(movieId)}
                        />
                      ) : null}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid container size={{ xs: 12, md: 4 }}>
                <ReviewForm
                  movies={
                    movies?.filter(
                      (movie): movie is NonNullable<typeof movie> => Boolean(movie)
                    ) || []
                  }
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={formError}
                  success={formSuccess}
                  currentUserName={currentUser?.name || undefined}
                  presetMovieId={selectedMovie}
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
