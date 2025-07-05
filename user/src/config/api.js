// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/user/login`,
  SIGNUP: `${API_BASE_URL}/user/signup`,
  PROFILE: `${API_BASE_URL}/user/profile`,
  LOGOUT: `${API_BASE_URL}/user/logout`,
  RESEND_VERIFICATION: `${API_BASE_URL}/user/resend-verification`,
  SETUP_PASSWORD: `${API_BASE_URL}/user/setup-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/user/verify-email`,
  UPDATE_PASSWORD: `${API_BASE_URL}/user/profile/password`,
  
  // Order endpoints
  ORDER: `${API_BASE_URL}/order`,
  REQUEST_OTP: `${API_BASE_URL}/order/request-otp`,
  
  // Google OAuth
  GOOGLE_AUTH: `${API_BASE_URL}/user/api/auth/google`,
  GOOGLE_AUTH_SIGNUP: `${API_BASE_URL}/user/api/auth/google?from=signup`,
  GOOGLE_AUTH_SELECT: `${API_BASE_URL}/user/api/auth/google?prompt=select_account`,
};

export default API_BASE_URL; 