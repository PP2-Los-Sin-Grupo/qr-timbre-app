import { alpha, createTheme } from '@mui/material/styles';

export const createAppTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            '--btn-hover-fill': 'transparent',
            '--btn-text-hover': 'currentColor',
            position: 'relative',
            isolation: 'isolate',
            borderRadius: theme.shape.borderRadius,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '100% 100%',
            backgroundSize: '0% 0%',
            backgroundImage:
              'radial-gradient(circle at 100% 100%, var(--btn-hover-fill) 0%, var(--btn-hover-fill) 70%, transparent 71%)',
            transition:
              'transform 220ms ease, box-shadow 220ms ease, background-color 260ms ease, background-size 420ms cubic-bezier(0.2, 0.7, 0.2, 1), color 260ms ease',
            '&.MuiButton-contained': {
              '--btn-hover-fill':
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[500]
                  : theme.palette.grey[700],
              '--btn-text-hover':
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[200]
                  : theme.palette.grey[100],
            },
            '&.MuiButton-containedPrimary': {
              '--btn-hover-fill': theme.palette.primary.dark,
            },
            '&.MuiButton-containedSuccess': {
              '--btn-hover-fill': theme.palette.success.dark,
            },
            '&.MuiButton-containedError': {
              '--btn-hover-fill': theme.palette.error.dark,
            },
            '&.MuiButton-containedWarning': {
              '--btn-hover-fill': theme.palette.warning.dark,
            },
            '&.MuiButton-containedInfo': {
              '--btn-hover-fill': theme.palette.info.dark,
            },
            '&.MuiButton-containedInherit': {
              '--btn-hover-fill':
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[600]
                  : theme.palette.grey[800],
            },
            '& > *': {
              position: 'relative',
              transition: 'color 260ms ease',
            },
            '&:hover': {
              transform: 'scale(1.04)',
              boxShadow: theme.shadows[6],
              color: 'var(--btn-text-hover)',
              backgroundSize: '260% 260%',
            },
            '&:active': {
              transform: 'scale(0.98)',
              boxShadow: theme.shadows[2],
              color: 'var(--btn-text-hover)',
              backgroundSize: '300% 300%',
            },
            '&.Mui-disabled': {
              transform: 'none',
              boxShadow: 'none',
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 200ms ease, background-color 240ms ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: '-35%',
              bottom: '-65%',
              width: '170%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              backgroundColor: alpha(
                theme.palette.common.white,
                theme.palette.mode === 'dark' ? 0.2 : 0.3
              ),
              transform: 'scale(0)',
              transformOrigin: 'bottom right',
              opacity: 0,
              transition: 'transform 360ms ease, opacity 240ms ease',
              pointerEvents: 'none',
            },
            '&:hover': {
              transform: 'scale(1.1)',
            },
            '&:hover::before': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&:active::before': {
              transform: 'scale(1.18)',
              opacity: 0.9,
            },
          }),
        },
      },
    },
  });
