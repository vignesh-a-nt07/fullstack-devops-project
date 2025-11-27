const HOST_URL = import.meta.env.VITE_BACKEND_HOST;
import { getToken } from '../utils/auth';
import { logger } from '../utils/logger';

/**
 * Centralized fetch wrapper that adds auth header (when available) and logs requests/responses.
 * Returns the raw Response so callers can preserve previous behaviour.
 */
async function fetchWithLogging(path: string, options: RequestInit = {}) {
  const url = `${HOST_URL}${path}`;
  const method = (options.method || 'GET').toString();
  const token = getToken();

  // Start with user-provided headers, fallback to json if none specified
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string> | undefined) || {
      'Content-Type': 'application/json',
    }),
  };
  // Add auth token if available and not already set
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure URL has protocol
  const fullUrl = url.startsWith('http') ? url : `http://${url}`;

  const bodyPreview =
    options.body && typeof options.body === 'string' ? options.body.slice(0, 1000) : undefined;

  logger.debug('API request', {
    url: fullUrl,
    method,
    headers,
    bodyPreview,
  });

  const start = Date.now();
  const res = await fetch(fullUrl, { ...options, headers });
  const time = Date.now() - start;
  try {
    // attempt to capture a brief response preview without consuming original stream
    const text = await res.clone().text();
    const preview = text ? text.slice(0, 1000) : '';
    logger.info('API response', {
      url: fullUrl,
      method,
      status: res.status,
      contentType: res.headers.get('content-type'),
      time,
      preview,
    });
  } catch (e) {
    logger.warn('API response preview failed', { url, method, err: String(e) });
  }
  if (!res.ok) {
    logger.warn('API non-ok response', { url, method, status: res.status });
  }
  return res;
}

// Config API functions
export async function fetchConfigs() {
  const response = await fetchWithLogging('v1/config', { method: 'GET' });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch configs';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createConfig(config: Record<string, unknown>) {
  const response = await fetchWithLogging('v1/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create config';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateConfig(configId: number, config: Record<string, unknown>) {
  const response = await fetchWithLogging(`v1/config/${configId}`, {
    method: 'PUT',
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update config';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function deleteConfig(configId: number) {
  const response = await fetchWithLogging(`v1/config/${configId}`, { method: 'DELETE' });
  if (!response.ok) {
    let errorMsg = 'Failed to delete config';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchCandidates(skip = 0, limit = 10) {
  const response = await fetchWithLogging(`v1/candidates/?skip=${skip}&limit=${limit}`, {
    method: 'GET',
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch candidates';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createCandidate(candidate: Record<string, unknown>) {
  const response = await fetchWithLogging('v1/candidates/', {
    method: 'POST',
    body: JSON.stringify(candidate),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create candidate';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateCandidate(candidateId: number, candidate: Record<string, unknown>) {
  const response = await fetchWithLogging(`v1/candidates/${candidateId}`, {
    method: 'PUT',
    body: JSON.stringify(candidate),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update candidate';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createUser(user: Record<string, unknown>) {
  const response = await fetchWithLogging('v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create user';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateUser(userId: number, user: Record<string, unknown>) {
  const response = await fetchWithLogging(`v1/auth/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update user';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchJobPosts() {
  const response = await fetchWithLogging('v1/jobposts/', { method: 'GET' });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch job posts';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function createJobPost(jobPost: Record<string, unknown>) {
  const response = await fetchWithLogging('v1/jobposts/', {
    method: 'POST',
    body: JSON.stringify(jobPost),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create job post';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function updateJobPost(jobId: number, jobPost: Record<string, unknown>) {
  const response = await fetchWithLogging(`v1/jobposts/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(jobPost),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update job post';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchUsers() {
  const response = await fetchWithLogging('v1/users', { method: 'GET' });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch users';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await response.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

/**
 * Fetch user details using the access token.
 * @param token - JWT access token
 * @returns Response from /api/v1/auth/me
 */
export async function fetchUserDetails(token: string) {
  const res = await fetchWithLogging('v1/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    let errorMsg = 'Failed to fetch user details';
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await res.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res;
}

export async function loginApi(username: string, password: string) {
  const res = await fetchWithLogging('v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
  });
  if (!res.ok) {
    let errorMsg = 'Failed to login';
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMsg = (await res.text()) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res;
}
