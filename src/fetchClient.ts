export const BASE_URL = "http://localhost:8080/api";

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  options.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(BASE_URL + url, options).then((response) => {
    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(error.message);
      });
    }

    return response.json();
  });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: any) => request<T>(url, 'POST', data),
  delete: (url: string, data: any) => request(url, 'DELETE', data),
  patch: <T>(url: string, data?: any) => request<T>(url, 'PATCH', data),
};