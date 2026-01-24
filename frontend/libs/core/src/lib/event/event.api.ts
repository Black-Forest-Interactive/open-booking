export interface ChangeEvent {
  type: ChangeEventType,
  resourceId: string,
  resourceType: string,
  resourceStatus: string,
  timestamp: string,
}

export const ChangeEventType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  OTHER: 'OTHER',
} as const;

export type ChangeEventType = typeof ChangeEventType[keyof typeof ChangeEventType]
