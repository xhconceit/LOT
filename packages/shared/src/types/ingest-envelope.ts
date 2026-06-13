


export interface IngestEnvelope {
    topic: string
    clientId?: string
    payloadRaw: string
    receivedAt: number
}