// api.js

import axios from "axios";
import { customBaseUrl, customBaseDomain } from '../../config';

const defaultBaseUrl = "http://127.0.0.1:8000"; // Default base URL
const defaultBaseDomain = '127.0.0.1';

export const DOMAIN = customBaseDomain || defaultBaseDomain;
export const ADDRESS = `${DOMAIN}:8000`;

const baseUrl = customBaseUrl || defaultBaseUrl;

const api = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
