import { LOG_API } from '@/config';

// Secrets are masked even in dev logs so they don't end up in screenshots or pasted terminals.
const MASKED_KEYS = new Set(['password', 'access_token', 'refresh_token']);
const MAX_CHARS = 6000;

const mask = (value) => {
    if (Array.isArray(value)) return value.map(mask);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, MASKED_KEYS.has(key) ? '••••' : mask(v)]));
    }
    return value;
};

const pretty = (data) => {
    if (data === undefined || data === null || data === '') return '(empty)';
    let text;
    try {
        text = JSON.stringify(mask(data), null, 2);
    }
    catch {
        text = String(data);
    }
    return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n… (${text.length - MAX_CHARS} more characters)` : text;
};

const describe = (config) => `${String(config?.method ?? 'get').toUpperCase()} ${config?.url ?? ''}`;

const parseBody = (body) => {
    if (typeof body !== 'string') return body;
    try {
        return JSON.parse(body);
    }
    catch {
        return body;
    }
};

/** Dev-only: prints every request, response and error from an axios instance to the Metro terminal. */
export function attachApiLogger(instance, label = 'API') {
    if (!LOG_API) return;
    instance.interceptors.request.use((config) => {
        config.metadata = { start: Date.now() };
        const query = config.params && Object.keys(config.params).length > 0 ? `\n  query: ${JSON.stringify(config.params)}` : '';
        const body = config.data !== undefined ? `\n  body: ${pretty(parseBody(config.data))}` : '';
        console.log(`[${label} →] ${describe(config)}${query}${body}`);
        return config;
    });
    instance.interceptors.response.use((response) => {
        const ms = Date.now() - (response.config.metadata?.start ?? Date.now());
        console.log(`[${label} ←] ${response.status} ${describe(response.config)} (${ms}ms)\n${pretty(response.data)}`);
        return response;
    }, (error) => {
        const config = error.config;
        const ms = Date.now() - (config?.metadata?.start ?? Date.now());
        if (error.response) {
            console.log(`[${label} ✗] ${error.response.status} ${describe(config)} (${ms}ms)\n${pretty(error.response.data)}`);
        }
        else {
            console.log(`[${label} ✗] ${describe(config)} (${ms}ms) no response: ${error.code ?? ''} ${error.message}`);
        }
        return Promise.reject(error);
    });
}
