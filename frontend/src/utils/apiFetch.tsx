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
 * @returns {Promise<Response>} The response from the fetch request.
 */
export const apiFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}