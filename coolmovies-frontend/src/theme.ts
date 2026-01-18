import { createTheme } from '@mui/material/styles';

const primary = '#35693a';
const secondary = '#d6a329';
const accent = 'rgba(81, 75, 129, 1)';

export const theme = createTheme({
  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    info: {
      main: accent,
    },
    background: {
      default: '#f4f7f3',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      'var(--font-lato), "Lato", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.01em',
      fontFamily: 'var(--font-abril), "Abril Fatface", serif',
    },
    h3: {
      fontWeight: 800,
      color: primary,
      fontFamily:
        'var(--font-roca-black), "Roca Black", var(--font-roca), "Roca", "Abril Fatface", serif',
    },
    h5: {
      fontFamily: 'var(--font-lato), "Lato"',
    },
    subtitle1: {
      color: 'rgba(0,0,0,0.64)',
      fontSize: '20px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontFamily: 'var(--font-lato), "Lato", "Helvetica Neue", Arial, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 35,
          borderWidth: 2,
          borderStyle: 'solid',
          fontFamily: 'var(--font-lato), "Lato", "Helvetica Neue", Arial, sans-serif',
          fontSize: '18px',
          padding: '8px 16px',
          [theme.breakpoints.up('lg')]: {
            padding: '12px 24px',
          },
          '&:hover': {
            borderWidth: 2,
          },
        }),
        containedPrimary: {
          borderStyle: 'solid',
          borderWidth: 2,
          backgroundColor: '#4b8152',
          borderColor: '#4b8152',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(75, 129, 82, 0)',
            borderColor: '#4b8152',
            color: '#4b8152',
          },
        },
        containedSecondary: {
          borderStyle: 'solid',
          borderWidth: 2,
          backgroundColor: '#d6a329',
          borderColor: '#d6a329',
          color: '#343935',
          '&:hover': {
            backgroundColor: 'rgba(214, 163, 41, 0)',
            borderColor: '#d6a329',
            color: '#d6a329',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});
