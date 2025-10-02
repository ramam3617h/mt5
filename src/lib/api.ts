const API_URL = 'http://localhost:3001/api';

let authToken: string | null = null;
let currentTenantId: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setTenantId = (tenantId: string | null) => {
  currentTenantId = tenantId;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (currentTenantId) {
    headers['X-Tenant-Id'] = currentTenantId;
  }

  return headers;
};

export const api = {
  auth: {
    signup: async (email: string, password: string, tenantName: string, tenantDomain: string) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantName, tenantDomain }),
      });
      return response.json();
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return response.json();
    },
  },

  customers: {
    list: async () => {
      const response = await fetch(`${API_URL}/customers`, {
        headers: getHeaders(),
      });
      return response.json();
    },

    get: async (id: string) => {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        headers: getHeaders(),
      });
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.json();
    },
  },

  users: {
    list: async () => {
      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
      });
      return response.json();
    },

    invite: async (email: string, role: string) => {
      const response = await fetch(`${API_URL}/users/invite`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, role }),
      });
      return response.json();
    },

    updateRole: async (id: string, role: string) => {
      const response = await fetch(`${API_URL}/users/${id}/role`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role }),
      });
      return response.json();
    },

    remove: async (id: string) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.json();
    },
  },

  activities: {
    list: async (customerId?: string) => {
      const url = customerId
        ? `${API_URL}/activities?customer_id=${customerId}`
        : `${API_URL}/activities`;
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      return response.json();
    },

    create: async (data: any) => {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  analytics: {
    getDashboard: async () => {
      const response = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: getHeaders(),
      });
      return response.json();
    },
  },
};
