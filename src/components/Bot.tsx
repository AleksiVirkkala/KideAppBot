import { TextField, Button, Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../config/socket';
import LogEntry from './LogEntry';

export interface Log {
  msg?: string;
  value?: string;
  type: string;
}

const Bot = () => {
  const [eventUrl, setEventUrl] = useState('');
  const [token, setToken] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logData, setLogData] = useState<Log[]>([]);
  const logOutputRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    socket.on('newLog', log => {
      console.log(log);
      setLogData(logs => [...logs, log]);
      scrollLog();
    });
    socket.on('isRunningChanged', newValue => {
      setIsRunning(newValue);
    });
    return () => {
      socket.off('newLog');
      socket.off('isRunningChanged');
    };
  }, []);

  const runBot = () => {
    setLogData([]);
    socket.emit('reserve', { eventUrl, token });
  };
  const stopBot = () => {
    socket.emit('stop', { eventUrl });
  };
  const scrollLog = async () => {
    setTimeout(() => {
      if (logOutputRef.current) {
        logOutputRef.current.lastElementChild?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    }, 100);
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
              type="password"
              onChange={e => setToken(e.target.value)}
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
        {logData.map((log, index) => (
          <LogEntry log={log} key={index} />
        ))}
      </Box>
    </Box>
  );
};

// 827b2ef6-ea3a-4548-8265-7189d0a5dc15
// eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjY4NGJjZTFlYWYzZDQxNDI4ZDQ2NThlYWIwMTJmYzNjIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFsZWtzaS52aXJra2FsYUB0dW5pLmZpIiwic3ViIjoiYWxla3NpLnZpcmtrYWxhQHR1bmkuZmkiLCJ1c2VyX2lkIjoiY2JjMDJhMzUtY2YzNC00N2ZiLTlmOWUtNjBkNDBhZmJhZTFmIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMCIsIm5iZiI6MTY0OTc3NjE3OCwiZXhwIjoxNjY1MzI4MTc4LCJpc3MiOiJodHRwczovL2F1dGgua2lkZS5hcHAiLCJhdWQiOiI1NmQ5Y2JlMjJhNTg0MzJiOTdjMjg3ZWFkZGEwNDBkZiJ9.FriMfWqS5WRjAneMSAtPI73lACw_EvCVwP74W_vqgTooE6N3iM6FNo2-Jg8rBIHCTPHKjyDlBpGGbXXkBmFbMw

export default Bot;
