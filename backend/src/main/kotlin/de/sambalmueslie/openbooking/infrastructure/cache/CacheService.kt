package de.sambalmueslie.openbooking.infrastructure.cache


import com.github.benmanes.caffeine.cache.Cache
import de.sambalmueslie.openbooking.infrastructure.cache.api.CacheInfo
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

@Singleton
class CacheService {

    companion object {
        private val logger = LoggerFactory.getLogger(CacheService::class.java)
    }

    private val caches = mutableMapOf<String, Cache<*, *>>()

    fun <T : Any, O : Any, C : Cache<T, O?>> register(key: String, builder: () -> C): C {
        logger.info("Register cache for $key")
        val cache = builder.invoke()
        caches[key] = cache
        return cache
    }

    fun <T : Any, O : Any, C : Cache<T, O?>> register(type: KClass<O>, builder: () -> C): C {
        return register(type.java.canonicalName, builder)
    }

    fun get(key: String): CacheInfo? {
        val cache = caches[key] ?: return null
        return convert(key, cache)
    }

    fun getAll(): List<CacheInfo> {
        return caches.entries.map { convert(it.key, it.value) }
    }

    private fun convert(key: String, cache: Cache<*, *>): CacheInfo {
        val name = key.substringAfterLast('.')
        val stats = cache.stats()
        return CacheInfo(key, name, stats.hitCount(), stats.missCount(), stats.loadSuccessCount(), stats.loadFailureCount(), stats.totalLoadTime(), stats.evictionCount(), stats.evictionWeight())
    }

    fun reset(key: String): CacheInfo? {
        val cache = caches[key] ?: return null
        cache.invalidateAll()
        return convert(key, cache)
    }

    fun resetAll(): List<CacheInfo> {
        return caches.entries.map {
            it.value.invalidateAll()
            convert(it.key, it.value)
        }
    }


}
