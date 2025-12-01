export interface AuditLogEntry {
  id: number,
  timestamp: string,
  user: string,
  level: string,
  message: string,
  reference: string,
  source: string,
}
