import chalk from 'chalk'

const LOG_COLORS = {
  INFO: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#fadb14',
  ERROR: '#f5222d',
}

const LOG_TYPES = {
  NONE: 0,
  ERROR: 1,
  NORMAL: 2,
  DEBUG: 3,
}

const logType = process.env.LOG_TYPE || LOG_TYPES.NORMAL

const logTime = () => {
  const now = new Date()

  return chalk.hex(LOG_COLORS.WARNING)(
    `[${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour12: false })}]`
  )
}

const info = (...args) => {
  if (logType < LOG_TYPES.NORMAL) return
  console.log(logTime(), `[${process.pid}]`, chalk.hex(LOG_COLORS.INFO)('[INFO]'), ...args)
}

const error = (...args) => {
  if (logType < LOG_TYPES.ERROR) return
  console.log(logTime(), `[${process.pid}]`, chalk.hex(LOG_COLORS.ERROR)('[ERROR]'), ...args)
}

const debug = (...args) => {
  if (logType < LOG_TYPES.DEBUG) return
  console.log(logTime(), `[${process.pid}]`, chalk.hex(LOG_COLORS.WARNING)('[DEBUG]'), ...args)
}

export { info, error, debug }