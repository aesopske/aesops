type LogLevel = 'info' | 'warn' | 'error'

function log(level: LogLevel, route: string, message: string, meta?: Record<string, unknown>) {
    const entry = { level, route, message, ...meta, timestamp: new Date().toISOString() }
    const write = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    write(JSON.stringify(entry))
}

export const logger = {
    info: (route: string, message: string, meta?: Record<string, unknown>) => log('info', route, message, meta),
    warn: (route: string, message: string, meta?: Record<string, unknown>) => log('warn', route, message, meta),
    error: (route: string, message: string, meta?: Record<string, unknown>) => log('error', route, message, meta),
}
