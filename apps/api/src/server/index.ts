import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { getAllowedOrigins, getServerPort } from '@/utils'
import cors from 'cors'
import { isDev } from '@common/utils'

import { applyWSSHandler } from '@trpc/server/adapters/ws'
import ws from 'ws'
import { AppRouter, appRouter } from './routes'
import { createContext } from '@/server/trpc-shared'

export const startServer = () => {
  const serverPort = getServerPort()

  // http server
  const { server, listen } = createHTTPServer({
    middleware: cors({
      origin: isDev() ? '*' : getAllowedOrigins(),
      credentials: true
    }),

    router: appRouter,
    createContext
  })

  // ws server
  const wss = new ws.WebSocketServer({ server })
  const handler = applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext
  })

  const { port } = listen(serverPort)
  console.log(`Bot backend started on port ${port}`)

  // TODO: Find out what event turborepo uses to restart the server
  process.on('SIGTERM', () => {
    console.log('SIGTERM')
    handler.broadcastReconnectNotification()
    wss.close()
  })
}
