import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MoviesWithReviewsQuery } from '../../../generated/graphql';

type MovieNode = NonNullable<
  NonNullable<MoviesWithReviewsQuery['allMovies']>['nodes'][number]
>;

type FormValues = {
  movieId: string;
  title: string;
  body: string;
  rating: number | null;
};

type Props = {
  movies: MovieNode[];
  onSubmit: (values: Required<Omit<FormValues, 'rating'>> & { rating: number }) => Promise<void> | void;
  submitting?: boolean;
  error?: string;
  success?: string;
  currentUserName?: string;
  presetMovieId?: string;
};

const initialValues: FormValues = {
  movieId: '',
  title: '',
  body: '',
  rating: null,
};

export const ReviewForm = ({
  movies,
  onSubmit,
  submitting,
  error,
  success,
  currentUserName,
  presetMovieId,
}: Props) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    movieId: false,
    title: false,
    body: false,
    rating: false,
  });
  const [validationError, setValidationError] = useState<string>();

  useEffect(() => {
    if (presetMovieId) {
      setValues((current) => ({ ...current, movieId: presetMovieId }));
    } else if (!values.movieId && movies.length) {
      setValues((current) => ({ ...current, movieId: String(movies[0]?.id) }));
    }
  }, [movies, presetMovieId]);

  useEffect(() => {
    if (success) {
      setValues((current) => ({
        movieId:
          presetMovieId || current.movieId || (movies[0] ? String(movies[0].id) : ''),
        title: '',
        body: '',
        rating: null,
      }));
      setTouched({
        movieId: false,
        title: false,
        body: false,
        rating: false,
      });
    }
  }, [movies, presetMovieId, success]);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.movieId) next.movieId = 'Choose a movie';
    if (!values.title.trim()) next.title = 'Title is required';
    if (values.rating == null) next.rating = 'Rating is required';
    return next;
  }, [values.movieId, values.rating, values.title]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({
      movieId: true,
      title: true,
      body: true,
      rating: true,
    });

    const firstError = errors.title || errors.rating || errors.movieId;
    if (firstError) {
      setValidationError(firstError);
      return;
    }
    setValidationError(undefined);

    await onSubmit({
      movieId: values.movieId,
      title: values.title.trim(),
      body: values.body.trim(),
      rating: values.rating || 0,
    });
  };

  const disableSubmit = submitting || !currentUserName;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: '#ffffff',
        padding: 3,
        borderRadius: 1,
        boxShadow: '0px 20px 40px rgba(15, 118, 110, 0.08)',
        border: '1px solid #e6edf5',
        width: '100%',
        alignSelf: 'flex-start',
        alignItems: 'stretch',
      }}
    >
      <Box>
        <Typography variant='h5' gutterBottom>
          Add a review
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {currentUserName
            ? `You are signed in as ${currentUserName}.`
            : 'A user is required to submit a review.'}
        </Typography>
      </Box>

      {success ? (
        <Alert severity='success' role='status'>
          {success}
        </Alert>
      ) : null}
      {error ? (
        <Alert severity='error' role='alert'>
          {error}
        </Alert>
      ) : null}
      {validationError ? (
        <Alert severity='warning' role='alert'>
          {validationError}
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <FormControl fullWidth error={touched.movieId && Boolean(errors.movieId)}>
          <InputLabel id='movie-select-label'>Movie</InputLabel>
          <Select
            labelId='movie-select-label'
            label='Movie'
            value={values.movieId}
            onChange={(event) =>
              setValues((current) => ({ ...current, movieId: event.target.value }))
            }
            onBlur={() => setTouched((state) => ({ ...state, movieId: true }))}
            MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={String(movie.id)}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>
          {touched.movieId && errors.movieId ? (
            <FormHelperText>{errors.movieId}</FormHelperText>
          ) : null}
        </FormControl>

        <TextField
          label='Review title'
          value={values.title}
          onChange={(event) =>
            setValues((current) => ({ ...current, title: event.target.value }))
          }
          onBlur={() => setTouched((state) => ({ ...state, title: true }))}
          required
          error={touched.title && Boolean(errors.title)}
          helperText={touched.title && errors.title ? errors.title : undefined}
        />

        <TextField
          label='What did you think?'
          value={values.body}
          onChange={(event) =>
            setValues((current) => ({ ...current, body: event.target.value }))
          }
          onBlur={() => setTouched((state) => ({ ...state, body: true }))}
          multiline
          minRows={3}
          placeholder='Share a quick note about the movie'
        />

        <Stack spacing={1}>
          <Typography variant='subtitle2'>Rating</Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems='center'
          >
            <Rating
              name='rating'
              value={values.rating}
              precision={1}
              max={5}
              onChange={(_, value) =>
                setValues((current) => ({ ...current, rating: value }))
              }
              onBlur={() => setTouched((state) => ({ ...state, rating: true }))}
              getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}`}
            />
            <FormControl
              size='small'
              sx={{ minWidth: 140 }}
              error={touched.rating && Boolean(errors.rating)}
            >
              <InputLabel id='rating-select-label'>Rating value</InputLabel>
              <Select
                labelId='rating-select-label'
                label='Rating value'
                value={
                  typeof values.rating === 'number' ? String(values.rating) : ''
                }
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    rating: Number(event.target.value),
                  }))
                }
                onBlur={() => setTouched((state) => ({ ...state, rating: true }))}
              >
                <MenuItem value=''>Select rating</MenuItem>
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {`${value} Star${value > 1 ? 's' : ''}`}
                  </MenuItem>
                ))}
              </Select>
              {touched.rating && errors.rating ? (
                <FormHelperText>{errors.rating}</FormHelperText>
              ) : null}
            </FormControl>
          </Stack>
        </Stack>
      </Stack>

      <Button
        type='submit'
        variant='contained'
        size='medium'
        disabled={disableSubmit}
        sx={{ alignSelf: 'center', mt: 1 }}
      >
        {submitting ? 'Submitting...' : 'Submit review'}
      </Button>
    </Box>
  );
};
