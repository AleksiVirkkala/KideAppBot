import React from 'react';
import type { AppRouter } from 'kideappbot-backend';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { getToken } from '.';
import { Log } from '@common/types';

export const trpc = createTRPCReact<AppRouter>();

export const useIsRunning = () => {
  const [isRunning, setIsRunning] = useState(false);
  trpc.bot.isRunningChanged.useSubscription(
    { token: getToken() },
    {
      onData(running) {
        setIsRunning(running);
      }
    }
  );
  return isRunning;
};

export const useLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  trpc.bot.newLog.useSubscription(
    { token: getToken() },
    {
      onData(log) {
        setLogs(logs => {
          if (log.replace) {
            logs.pop();
          }
          return [...logs, log];
        });
      }
    }
  );
  return logs;
};

export const useStartBot = () => {
  const sb = trpc.bot.reserve.useMutation();
  return (eventUrl: string) => sb.mutate({ token: getToken(), eventUrl });
};

export const useStopBot = () => {
  const sb = trpc.bot.stop.useMutation();
  return () => sb.mutate({ token: getToken() });
};
