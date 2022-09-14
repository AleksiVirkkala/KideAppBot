import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { socket } from '../config/socket';

interface Log {
  msg?: string;
  value?: string | number;
  type?: string;
}

const Bot = () => {
  const [eventID, setEventID] = useState('');
  const [token, setToken] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logData, setLogData] = useState<Log[]>([]);

  useEffect(() => {
    socket.on('logsChanged', log => {
      console.log(log);
      setLogData(logs => [...logs, log]);
      // setLogData([...logData, log]);
    });
    socket.on('isRunningChanged', newValue => {
      setIsRunning(newValue);
    });
    return () => {
      socket.off('logsChanged');
      socket.off('isRunningChanged');
    };
  }, []);

  const runBot = () => {
    socket.emit('reserve', { eventID, token });
  };
  const stopBot = () => {
    socket.emit('stop', { eventID });
  };

  return (
    <Box>
      <Box m={10} display="flex" alignContent="center" justifyContent="center">
        <TextField
          label="Event ID"
          onChange={e => setEventID(e.target.value)}
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
      <Box>
        {logData.map((log, index) => (
          <Box key={index}>
            {log.msg} {log.value} {log.type}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// 827b2ef6-ea3a-4548-8265-7189d0a5dc15
// eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6IjY4NGJjZTFlYWYzZDQxNDI4ZDQ2NThlYWIwMTJmYzNjIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFsZWtzaS52aXJra2FsYUB0dW5pLmZpIiwic3ViIjoiYWxla3NpLnZpcmtrYWxhQHR1bmkuZmkiLCJ1c2VyX2lkIjoiY2JjMDJhMzUtY2YzNC00N2ZiLTlmOWUtNjBkNDBhZmJhZTFmIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMCIsIm5iZiI6MTY0OTc3NjE3OCwiZXhwIjoxNjY1MzI4MTc4LCJpc3MiOiJodHRwczovL2F1dGgua2lkZS5hcHAiLCJhdWQiOiI1NmQ5Y2JlMjJhNTg0MzJiOTdjMjg3ZWFkZGEwNDBkZiJ9.FriMfWqS5WRjAneMSAtPI73lACw_EvCVwP74W_vqgTooE6N3iM6FNo2-Jg8rBIHCTPHKjyDlBpGGbXXkBmFbMw

export default Bot;
