export interface ApiServiceConfig {
    corsOrigin: string;
    port: number;
}
export const ApiServiceConfig:ApiServiceConfig = {
    corsOrigin: process.env.CORS_ORIGIN ?? "*",
    port: Number(process.env.PORT) || 3000,
}

export default ApiServiceConfig;