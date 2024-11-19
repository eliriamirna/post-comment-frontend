import { configUrl } from './config'

export const customFetch = async (endpoint: string, options: any = {}, isJson = true) => {
    const token = localStorage.getItem('token');
  
    const headers = {
      ...options.headers,
    };
  
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const config = {
      ...options,
      headers,
    };
  
    const response = await fetch(`${configUrl}${endpoint}`, config);
  
    return response;
  };