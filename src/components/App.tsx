import { theme } from '../theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import NavBar from './NavBar';
import PageBackground from './PageBackground';
import Bot from './Bot';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        id="app"
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <NavBar />
        <PageBackground>
          <Bot></Bot>
        </PageBackground>
      </div>
    </ThemeProvider>
  );
};

export default App;
