import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { FC } from 'react';
import type { Log } from '@common/types';

const LogEntry: FC<{ log: Log }> = ({ log }) => {
  const getPrefix = (type: string) => {
    if (!type) return '';
    if (type === 'e') return '❌';
    else if (type === 'w') return '⚠️';
    // Warning
    else if (type === 's') return '✅';
    // Success
    else if (type === 'l') return '⌛';
    // Loading
    else if (type === 'f') return '🛰️';
    // fetch
    else if (type === 'b') return '•';
    // Bullet point
  };

  const fontVariant = log.type === 't' ? 'subtitle2' : 'caption';
  const emptyRow = !log.msg;

  return (
    <Box
      sx={{
        backgroundColor: '',
        height: emptyRow ? '10px' : '20px',
        lineHeight: '20px'
      }}
    >
      <Typography variant={fontVariant}>
        {getPrefix(log.type || '')} {log.msg}{' '}
        {log.value && (
          <Typography
            variant="caption"
            sx={{
              color: '#d50000',
              padding: '2px 4px',
              borderRadius: 1,
              background: 'rgba(255, 0, 0, 0.05)',
              fontWeight: 'bold'
            }}
          >
            {log.value}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default LogEntry;
