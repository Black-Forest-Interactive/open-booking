import {inject, Injectable, signal} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {ChangeEvent} from "@open-booking/core";
import {EventChangeListener} from "./event.api";
import Keycloak from "keycloak-js";


@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {
  private readonly keycloak = inject(Keycloak)
  connectionStatus = signal<'connected' | 'disconnected' | 'reconnecting'>('disconnected')
  private listeners = new Set<EventChangeListener>()

  private controller?: AbortController
  private reconnectTimeout?: number


  constructor() {
    super('admin/event')
    this.connectToEventStream()
  }

  subscribe(listener: EventChangeListener) {
    this.listeners.add(listener)
  }

  unsubscribe(listener: EventChangeListener) {
    this.listeners.delete(listener)
  }


  private async connectToEventStream(): Promise<void> {
    if (this.controller) return

    this.connectionStatus.set('reconnecting')

    try {
      const token = this.keycloak.token
      if (!token) {
        this.handleDisconnect()
        return
      }
      const url = this.createUrl('stream')

      this.controller = new AbortController()

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream'
        },
        signal: this.controller.signal
      })

      if (!response.ok || !response.body) {
        throw new Error(`SSE failed with status ${response.status}`)
      }

      this.connectionStatus.set('connected')
      console.log('SSE connection opened')

      await this.readStream(response.body)
    } catch (error) {
      if ((error as any)?.name !== 'AbortError') {
        console.error('SSE connection error:', error)
      }
      this.handleDisconnect()
    }
  }


  private async readStream(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      while (true) {
        const {value, done} = await reader.read()
        if (done) break

        buffer += decoder.decode(value, {stream: true})

        // SSE messages end with a blank line
        const events = buffer.split('\n\n')
        buffer = events.pop()!

        for (const rawEvent of events) {
          this.handleRawEvent(rawEvent)
        }
      }
    } finally {
      reader.releaseLock()
      this.handleDisconnect()
    }
  }

  private handleRawEvent(raw: string) {
    try {
      const data = raw
        .split('\n')
        .filter(line => line.startsWith('data:'))
        .map(line => line.replace(/^data:\s?/, ''))
        .join('\n')

      if (!data) return

      const dataEvent: ChangeEvent = JSON.parse(data)

      if (
        dataEvent.type === 'OTHER' &&
        dataEvent.resourceId === 'CONNECTION'
      ) {
        console.log('Connected to event stream')
        return
      }

      this.notifySubscribers(dataEvent)
    } catch (error) {
      console.error('Error parsing SSE event:', error, raw)
    }
  }


  private notifySubscribers(event: ChangeEvent): void {
    this.listeners.forEach(handler => {
      try {
        handler.handleEvent(event)
      } catch (error) {
        console.error('Error in event handler:', error)
      }
    })
  }

  private handleDisconnect() {
    this.connectionStatus.set('disconnected')
    this.controller = undefined

    clearTimeout(this.reconnectTimeout)
    this.reconnectTimeout = window.setTimeout(
      () => this.connectToEventStream(),
      5000
    )
  }

  // Disconnect SSE
  disconnect(): void {
    clearTimeout(this.reconnectTimeout)
    this.controller?.abort()
    this.controller = undefined
    this.connectionStatus.set('disconnected')
  }

  // Reconnect SSE
  reconnect(): void {
    this.disconnect()
    this.connectToEventStream()
  }

}
