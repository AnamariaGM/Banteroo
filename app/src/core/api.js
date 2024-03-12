import axios from "axios";
import { Platform } from "react-native";

// export const ADDRESS = Platform.OS === 'ios'
// ? 'https://8e1e-2a02-c7c-8506-8300-fc7-85cb-764b-5ea6.ngrok-free.app:8000'
// : '10.0.2.2:8000'
export const DOMAIN ="8e1e-2a02-c7c-8506-8300-fc7-85cb-764b-5ea6.ngrok-free.app"
export const ADDRESS = "8e1e-2a02-c7c-8506-8300-fc7-85cb-764b-5ea6.ngrok-free.app:8000"

const api = axios.create({
  // baseURL:'http://'+ ADDRESS,
  baseURL: "https://8e1e-2a02-c7c-8506-8300-fc7-85cb-764b-5ea6.ngrok-free.app",

  timeout:1000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
