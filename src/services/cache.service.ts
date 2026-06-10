import { createClient, RedisClientType } from 'redis'

type MemoryEntry = {
    value: string
    expiresAt: number
}

const namespace = process.env.CACHE_NAMESPACE || 'siceref'
const memoryCache = new Map<string, MemoryEntry>()

let redisClient: RedisClientType | null = null
let connectPromise: Promise<RedisClientType | null> | null = null
let redisWarningShown = false

const fullKey = (key: string) => `${namespace}:${key}`

const warnRedisUnavailable = (error: unknown) => {
    if (redisWarningShown) return
    redisWarningShown = true
    console.warn('Redis cache unavailable, using in-memory cache fallback:', error instanceof Error ? error.message : error)
}

const getRedisClient = async () => {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) return null
    if (redisClient?.isOpen) return redisClient
    if (connectPromise) return connectPromise

    redisClient = createClient({ url: redisUrl }) as RedisClientType
    redisClient.on('error', warnRedisUnavailable)

    connectPromise = redisClient.connect()
        .then(() => redisClient)
        .catch((error) => {
            warnRedisUnavailable(error)
            redisClient = null
            return null
        })
        .finally(() => {
            connectPromise = null
        })

    return connectPromise
}

export const CacheService = {
    get: async <T>(key: string): Promise<T | null> => {
        const resolvedKey = fullKey(key)

        try {
            const client = await getRedisClient()
            const value = client ? await client.get(resolvedKey) : null
            if (value) return JSON.parse(value) as T
        } catch (error) {
            warnRedisUnavailable(error)
        }

        const entry = memoryCache.get(resolvedKey)
        if (!entry) return null
        if (entry.expiresAt < Date.now()) {
            memoryCache.delete(resolvedKey)
            return null
        }

        return JSON.parse(entry.value) as T
    },

    set: async (key: string, value: unknown, ttlSeconds: number): Promise<void> => {
        const resolvedKey = fullKey(key)
        const serialized = JSON.stringify(value)

        try {
            const client = await getRedisClient()
            if (client) {
                await client.set(resolvedKey, serialized, { EX: ttlSeconds })
                return
            }
        } catch (error) {
            warnRedisUnavailable(error)
        }

        memoryCache.set(resolvedKey, {
            value: serialized,
            expiresAt: Date.now() + ttlSeconds * 1000,
        })
    },

    deleteByPrefix: async (prefix: string): Promise<void> => {
        const resolvedPrefix = fullKey(prefix)

        try {
            const client = await getRedisClient()
            if (client) {
                const keys = await client.keys(`${resolvedPrefix}*`)
                if (keys.length > 0) await client.del(keys)
            }
        } catch (error) {
            warnRedisUnavailable(error)
        }

        Array.from(memoryCache.keys())
            .filter((key) => key.startsWith(resolvedPrefix))
            .forEach((key) => memoryCache.delete(key))
    },
}
