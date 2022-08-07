import logo from '../assets/logoonlyletters.png';
import { AppBar, Box, Toolbar } from '@mui/material';
import NavBarMenu from './NavBarMenu';

const NavBar = () => {
  return (
    <AppBar position="relative">
      <Toolbar
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          color: 'white'
        }}
      >
        <img src={logo} alt="bot logo" height="50rem" />
        <Box sx={{ mr: 'auto' }}>Kide.app ticket bot</Box>
        <NavBarMenu></NavBarMenu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
