// API Client for NotesMarketplace
const API = {
  baseUrl: '/api',

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (AppState.token) {
      headers['Authorization'] = `Bearer ${AppState.token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...(options.headers || {})
      }
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, config);
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: 'Network response was not JSON' };
    }

    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

window.API = API;
