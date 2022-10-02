import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    socket.on('newLog', log => {
      console.log(log);
      setLogData(logs => [...logs, log]);
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

  return (
    <Box
      sx={{
        border: '5px solid green',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box m={10} display="flex" alignContent="center" justifyContent="center">
        <TextField
          label="Event URL"
          onChange={e => setEventUrl(e.target.value)}
        />
        <TextField
          label="Bearer Token"
          type="password"
          onChange={e => setToken(e.target.value)}
        />
        <Button onClick={runBot} disabled={isRunning}>
          Run
        </Button>
        <Button onClick={stopBot} disabled={!isRunning}>
          Stop
        </Button>
      </Box>
      <Box
        mx="20px"
        my="20px"
        py="20px"
        px="20px"
        sx={{
          borderRadius: '5px',
          border: '2px solid #e0e0e0',
          backgroundColor: '#eeeeee',
          overflow: 'scroll',
          flexGrow: 1
        }}
      >
        {logData.map((log, index) => (
          <LogEntry log={log} />
        ))}
      </Box>
    </Box>
  );
};

// 827b2ef6-ea3a-4548-8265-7189d0a5dc15
// eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjY4NGJjZTFlYWYzZDQxNDI4ZDQ2NThlYWIwMTJmYzNjIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFsZWtzaS52aXJra2FsYUB0dW5pLmZpIiwic3ViIjoiYWxla3NpLnZpcmtrYWxhQHR1bmkuZmkiLCJ1c2VyX2lkIjoiY2JjMDJhMzUtY2YzNC00N2ZiLTlmOWUtNjBkNDBhZmJhZTFmIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMCIsIm5iZiI6MTY0OTc3NjE3OCwiZXhwIjoxNjY1MzI4MTc4LCJpc3MiOiJodHRwczovL2F1dGgua2lkZS5hcHAiLCJhdWQiOiI1NmQ5Y2JlMjJhNTg0MzJiOTdjMjg3ZWFkZGEwNDBkZiJ9.FriMfWqS5WRjAneMSAtPI73lACw_EvCVwP74W_vqgTooE6N3iM6FNo2-Jg8rBIHCTPHKjyDlBpGGbXXkBmFbMw

export default Bot;
