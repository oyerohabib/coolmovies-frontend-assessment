import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { MoviesWithReviewsQuery } from '../../../generated/graphql';

type MovieNode = NonNullable<
  NonNullable<MoviesWithReviewsQuery['allMovies']>['nodes'][number]
>;

type Props = {
  movie: MovieNode;
  onAddReview?: (movieId: string) => void;
};

const getAverageRating = (movie: MovieNode) => {
  const ratings =
    movie.movieReviewsByMovieId?.nodes
      ?.map((node) => node?.rating)
      .filter((value): value is number => typeof value === 'number') || [];

  if (!ratings.length) return null;

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * 10) / 10;
};

export const MovieCard = ({ movie, onAddReview }: Props) => {
  const avgRating = getAverageRating(movie);
  const reviews =
    movie.movieReviewsByMovieId?.nodes?.filter(
      (review): review is NonNullable<typeof review> => Boolean(review)
    ) || [];

  const year = movie.releaseDate
    ? new Date(movie.releaseDate as any).getFullYear()
    : undefined;

  return (
    <Card
      elevation={0}
      sx={{
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e6edf5',
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={movie.imgUrl}
            alt={`${movie.title} poster`}
            sx={{ width: 52, height: 52, border: '1px solid #e5e7eb' }}
          />
        }
        title={
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography variant='h6'>{movie.title}</Typography>
            {year ? (
              <Chip label={year} size='small' color='secondary' />
            ) : null}
          </Stack>
        }
        subheader={
          <Typography variant='body2' color='text.secondary'>
            {movie.movieDirectorByMovieDirectorId?.name || 'Unknown director'}
          </Typography>
        }
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Rating value={avgRating || 0} precision={0.5} readOnly />
          <Typography variant='body2' color='text.secondary'>
            {avgRating ? `${avgRating} / 5 (${reviews.length})` : 'No ratings'}
          </Typography>
        </Stack>

        <Stack spacing={1.5} divider={<Divider flexItem />} sx={{ flex: 1 }}>
          {reviews.length ? (
            reviews.map((review) => (
              <Box key={review.id} sx={{ display: 'grid', gap: 0.25 }}>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <Rating
                    value={review.rating || 0}
                    precision={1}
                    readOnly
                    size='small'
                  />
                  <Typography variant='subtitle2'>{review.title}</Typography>
                </Stack>
                <Typography variant='body2' color='text.secondary'>
                  {review.body || 'No description provided.'}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {`by ${review.userByUserReviewerId?.name || 'Anonymous'}`}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No reviews yet. Be the first to add one!
            </Typography>
          )}
        </Stack>
        {onAddReview ? (
          <Button
            variant='contained'
            color='primary'
            onClick={() => onAddReview(String(movie.id))}
            sx={{ alignSelf: 'center' }}
          >
            Add review
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
