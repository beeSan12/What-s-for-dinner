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
export const apiFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 401) {
    // Token has expired or is invalid
    localStorage.removeItem('token')
    // Redirect to login page
    window.location.href = '/login'
    // Do not return the response
    // Instead, reject the promise with an error
    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized',
    })
  }
  //   return Promise.reject(new Error('Unauthorized'))
  // }

  return response
}
