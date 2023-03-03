import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createWSClient,
  httpBatchLink,
  httpLink,
  loggerLink,
  splitLink,
  wsLink
} from '@trpc/client';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const wsClient = createWSClient({
  // TODO: Set the url based on the environment
  url: `ws://localhost:3000`
});

export default function TrpcWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // TODO: Add env condition
        loggerLink(),
        // call subscriptions through websockets and the rest over http
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: wsLink({
            client: wsClient
          }),
          false: httpLink({
            // TODO: Set the url based on the environment
            url: `http://localhost:3000`
          })
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
