export const OLLAMA_CONFIG = {
    API_URL: process.env.OLLAMA_API_URL || 'http://0.0.0.0:11434',
    DEFAULT_MODEL: 'llama2',
    TIMEOUT: 30000, // 30 segundos
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 segundo
};
