import { buildApp } from './app.js'
import 'dotenv/config'

const app = buildApp()

const closeServer = async () => {
  try {
    await app.close()
  } catch (error) {
    app.log.error(error)
    process.exitCode = 1
  }
}

process.once('SIGINT', () => {
  void closeServer()
})

process.once('SIGTERM', () => {
  void closeServer()
})

try {
  await app.listen({
    port: 4001,
    host: '127.0.0.1',
  })
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
  await closeServer()
}

export { closeServer }
