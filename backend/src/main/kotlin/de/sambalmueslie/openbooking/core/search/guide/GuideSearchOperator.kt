package de.sambalmueslie.openbooking.core.search.guide

import com.jillesvangurp.ktsearch.SearchResponse
import com.jillesvangurp.ktsearch.ids
import com.jillesvangurp.ktsearch.total
import de.sambalmueslie.openbooking.config.OpenSearchConfig
import de.sambalmueslie.openbooking.core.guide.GuideChangeListener
import de.sambalmueslie.openbooking.core.guide.GuideService
import de.sambalmueslie.openbooking.core.guide.api.Guide
import de.sambalmueslie.openbooking.core.guide.api.GuideChangeRequest
import de.sambalmueslie.openbooking.core.search.common.BaseOpenSearchOperator
import de.sambalmueslie.openbooking.core.search.common.SearchClientFactory
import de.sambalmueslie.openbooking.core.search.common.SearchRequest
import de.sambalmueslie.openbooking.core.search.guide.api.GuideSearchRequest
import de.sambalmueslie.openbooking.core.search.guide.api.GuideSearchResponse
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Singleton
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Singleton
open class GuideSearchOperator(
    private val service: GuideService,

    private val fieldMapping: GuideFieldMappingProvider,
    private val queryBuilder: GuideSearchQueryBuilder,
    config: OpenSearchConfig,
    openSearch: SearchClientFactory
) : BaseOpenSearchOperator<Guide, GuideSearchRequest, GuideSearchResponse>(openSearch, "guide", config, logger) {
    companion object {
        private val logger: Logger = LoggerFactory.getLogger(GuideSearchOperator::class.java)
    }

    init {
        service.register(object : GuideChangeListener {
            override fun handleCreated(obj: Guide, request: GuideChangeRequest) {
                handleChanged(obj)
            }

            override fun handleUpdated(obj: Guide, request: GuideChangeRequest) {
                handleChanged(obj)
            }

            override fun handlePatched(obj: Guide) {
                handleChanged(obj)
            }

            override fun handleDeleted(obj: Guide) {
                deleteDocument(obj.id.toString())
            }
        })
    }

    private fun handleChanged(category: Guide) {
        val data = convert(category)
        updateDocument(data)
    }


    override fun getFieldMappingProvider() = fieldMapping
    override fun getSearchQueryBuilder() = queryBuilder

    override fun initialLoadPage(pageable: Pageable): Page<Pair<String, String>> {
        val page = service.getAll(pageable)
        return page.map { convert(it) }
    }

    private fun convert(obj: Guide): Pair<String, String> {
        val input = GuideSearchEntryData.create(obj)
        return Pair(input.id, mapper.writeValueAsString(input))
    }

    override fun processSearchResponse(
        request: SearchRequest, response: SearchResponse, pageable: Pageable
    ): GuideSearchResponse {
        val ids = response.ids.map { it.toLong() }.toSet()
        val result = service.getByIds(ids)

        return GuideSearchResponse(Page.of(result, pageable, response.total))
    }


}