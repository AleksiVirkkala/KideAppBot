import { createTheme } from '@mui/material';

const ORANGE = '#f04e30';
const WHITE = '#ffffff';
const FOCUS = '#512DA8';

export const theme = createTheme({
  palette: {
    background: { default: WHITE },
    primary: { main: FOCUS }
  },
  typography: {
    h3: { color: ORANGE },
    h4: { color: ORANGE, fontWeight: 'bold' },
    h5: { color: ORANGE, fontWeight: 'bold' }
  }
});
