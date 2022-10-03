import { Box } from '@mui/material';

const PageBackground = (props: { children?: JSX.Element }) => {
  return (
    <Box
      flexGrow="1"
      sx={{
        backgroundColor: 'white',
        // border: '4px solid red',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'hidden'
      }}
    >
      {props.children}
    </Box>
  );
};

export default PageBackground;
