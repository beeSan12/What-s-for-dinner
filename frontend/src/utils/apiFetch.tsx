/**
 * This file contains a utility function to fetch data from an API.
 * It automatically includes the Authorization header with the token stored in localStorage.
 *
 * @file apiFetch
 * @author Beatriz Sanssi
 */

/**
 * This function is used to fetch data from the API with the provided URL and options.
 *
 * @param url The URL to fetch data from.
 * @param options The options for the fetch request, such as method, headers, body, etc.
 * @returns A promise that resolves to the JSON response from the API.
 */
export const apiFetch = async <T = unknown,>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  })

  if (response.status === 401) {
    // Token has expired or is invalid
    localStorage.removeItem('token')
    // Redirect to login page
    window.location.href = '/login'
    // Do not return the response
    // Instead, reject the promise with an error
    throw new Error('Unauthorized')
  }
  console.log('🔐 Sending request to', url)
  console.log('📦 Headers:', {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  })

  // return response
  const contentType = response.headers.get('content-type') || ''
  const raw = await response.text()

  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${raw}`)
  }

  if (!contentType.includes('application/json')) {
    throw new Error(`Not JSON, raw response: ${raw.slice(0, 300)}`)
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error('Failed to parse JSON: ' + err)
  }
}
