package de.sambalmueslie.openbooking.infrastructure.settings

import de.sambalmueslie.openbooking.common.EntityChangeListener
import de.sambalmueslie.openbooking.infrastructure.settings.api.Setting
import de.sambalmueslie.openbooking.infrastructure.settings.api.SettingChangeRequest

interface SettingChangeListener : EntityChangeListener<Long, Setting, SettingChangeRequest> {
}