import { TextField, Button, Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { LogEntry } from 'ui-components';
import { useIsRunning, useLogs, useStartBot, useStopBot } from '../utils/trpc';

const TOKEN_STORAGE_KEY = 'token';
const LOG_SCROLL_DELAY = 100;

const Bot = () => {
  const isRunning = useIsRunning();
  const logs = useLogs();
  const startBot = useStartBot();
  const stopBot = useStopBot();
  const [eventUrl, setEventUrl] = useState('');
  const [token, setToken] = useState('');
  const logOutputRef = useRef<HTMLElement | null>(null);

  const runBot = () => {
    startBot(eventUrl);
  };

  // Restore token value
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (typeof savedToken === 'string') {
      setToken(savedToken);
    }
  });

  const onTokenInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const token = e.target.value;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setToken(token);
  };

  const scrollLog = async () => {
    setTimeout(() => {
      if (logOutputRef.current) {
        logOutputRef.current.lastElementChild?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    }, LOG_SCROLL_DELAY);
  };

  return (
    <Box
      sx={{
        // border: '5px solid green',
        flexGrow: 1,
        justifySelf: 'start',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1000px'
      }}
      m={3}
    >
      <Box mb={3}>
        <Box sx={{ typography: 'h6' }}>Info</Box>
        <Box mb={3} sx={{ typography: 'body1' }}>
          The bot will add maximum amount of tickets to your kide.app cart based
          on given event url.
        </Box>
        <Box>
          <Box display="flex" alignContent="center" justifyContent="center">
            <TextField
              label="Event URL"
              fullWidth
              onChange={e => setEventUrl(e.target.value)}
              sx={{ marginRight: '12px', maxWidth: '500px' }}
            />
            <TextField
              label="Bearer Token"
              fullWidth
              value={token}
              type="password"
              onChange={onTokenInput}
              sx={{ marginRight: '12px', maxWidth: '500px' }}
            />
            <Button
              onClick={isRunning ? stopBot : runBot}
              variant={isRunning ? 'outlined' : 'contained'}
              sx={{ marginLeft: 'auto', width: '80px' }}
            >
              {isRunning ? 'Stop' : 'Run'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        p="20px"
        ref={logOutputRef}
        sx={{
          borderRadius: '5px',
          border: '2px solid #e0e0e0',
          backgroundColor: '#eeeeee',
          overflowY: 'scroll',
          flexGrow: 1
        }}
      >
        {logs.map((log, index) => (
          <LogEntry log={log} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default Bot;
