package de.sambalmueslie.openbooking.infrastructure.settings

import de.sambalmueslie.openbooking.common.BusinessObjectChangeListener
import de.sambalmueslie.openbooking.infrastructure.settings.api.Setting

interface SettingChangeListener : BusinessObjectChangeListener<Long, Setting> {
}