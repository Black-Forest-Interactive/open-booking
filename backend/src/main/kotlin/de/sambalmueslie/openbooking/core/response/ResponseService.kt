package de.sambalmueslie.openbooking.core.response


import de.sambalmueslie.openbooking.common.GenericCrudService
import de.sambalmueslie.openbooking.common.TimeProvider
import de.sambalmueslie.openbooking.core.response.api.ResolvedResponse
import de.sambalmueslie.openbooking.core.response.api.Response
import de.sambalmueslie.openbooking.core.response.api.ResponseChangeRequest
import de.sambalmueslie.openbooking.core.response.api.ResponseType
import de.sambalmueslie.openbooking.core.response.db.ResponseData
import de.sambalmueslie.openbooking.core.response.db.ResponseRepository
import de.sambalmueslie.openbooking.core.response.resolve.ResponseResolver
import de.sambalmueslie.openbooking.error.InvalidRequestException
import de.sambalmueslie.openbooking.infrastructure.cache.CacheService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory

@Singleton
class ResponseService(
    private val repository: ResponseRepository,
    private val resolver: ResponseResolver,
    private val timeProvider: TimeProvider,
    cacheService: CacheService,
) : GenericCrudService<Long, Response, ResponseChangeRequest, ResponseChangeListener, ResponseData>(repository, cacheService, Response::class, logger) {

    companion object {
        private val logger = LoggerFactory.getLogger(ResponseService::class.java)
    }

    override fun createData(request: ResponseChangeRequest): ResponseData {
        return ResponseData.create(request, timeProvider.now())
    }

    override fun updateData(data: ResponseData, request: ResponseChangeRequest): ResponseData {
        return data.update(request, timeProvider.now())
    }

    override fun isValid(request: ResponseChangeRequest) {
        if (request.lang.isBlank()) throw InvalidRequestException("Language is not allowed to be blank")
        if (request.title.isBlank()) throw InvalidRequestException("Title is not allowed to be blank")
        if (request.content.isBlank()) throw InvalidRequestException("Content is not allowed to be blank")
    }

    fun find(lang: String, type: ResponseType): Response? {
        return findData(lang, type)?.convert()
    }

    fun resolve(lang: String, type: ResponseType, properties: MutableMap<String, Any>): ResolvedResponse? {
        val response = findData(lang, type) ?: return null
        return resolver.resolve(response.convert(), properties)
    }

    private fun findData(lang: String, type: ResponseType): ResponseData? {
        var response = repository.findOneByLangAndType(lang, type)
        if (response != null) return response
        response = repository.findOneByLangAndType("en", type)
        if (response != null) return response
        return repository.findOneByType(type)
    }

}
