package de.sambalmueslie.openbooking.infrastructure.export.excel


import builders.dsl.spreadsheet.api.BorderStyle
import builders.dsl.spreadsheet.api.Color
import builders.dsl.spreadsheet.api.FontStyle
import builders.dsl.spreadsheet.api.Keywords
import builders.dsl.spreadsheet.builder.api.CanDefineStyle
import builders.dsl.spreadsheet.builder.api.Stylesheet
import org.slf4j.LoggerFactory


class OfferExcelStylesheet : Stylesheet {

    companion object {
        private val logger = LoggerFactory.getLogger(OfferExcelStylesheet::class.java)
        const val STYLE_HEADER = "header"
        const val STYLE_OFFER_HEADER_ROW = "offer_header_row"
        const val STYLE_OFFER_HEADER_ROW_FIRST = "offer_header_row_first"
        const val STYLE_OFFER_HEADER_ROW_SECOND = "offer_header_row_second"
        const val STYLE_OFFER_HEADER_BOLD = "offer_header_bold"
        const val STYLE_OFFER_HEADER_TEXT = "offer_header_text"
    }

    override fun declareStyles(stylable: CanDefineStyle) {
        stylable.style(STYLE_HEADER) { st ->
            st.font { f ->
                f.style(FontStyle.BOLD)
                f.size(14)
            }
            st.border(Keywords.BorderSide.BOTTOM) { b ->
                b.style(BorderStyle.THIN)
                b.color(Color.black)
            }
        }

        stylable.style(STYLE_OFFER_HEADER_ROW) { st ->
            st.background(Color.lightGray)
        }

        stylable.style(STYLE_OFFER_HEADER_ROW_FIRST) { st ->
            st.background(Color.lightGray)
            st.border(Keywords.BorderSide.TOP) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.LEFT) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.RIGHT) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.BOTTOM) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
        }

        stylable.style(STYLE_OFFER_HEADER_ROW_SECOND) { st ->
            st.background(Color.lightGray)
            st.border(Keywords.BorderSide.TOP) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.LEFT) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.RIGHT) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
            st.border(Keywords.BorderSide.BOTTOM) { b ->
                b.style(BorderStyle.MEDIUM)
                b.color(Color.black)
            }
        }

        stylable.style(STYLE_OFFER_HEADER_BOLD) { st ->
            st.font { f ->
                f.style(FontStyle.BOLD)
            }
        }

        stylable.style(STYLE_OFFER_HEADER_TEXT) { st ->
            st.align(Keywords.VerticalAlignment.CENTER, Keywords.HorizontalAlignment.RIGHT)
        }
    }

}
