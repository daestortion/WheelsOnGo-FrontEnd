

// Determine the base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://wheelsongo-backend.onrender.com';

// Optionally, you can log the base URL to verify it's being set correctly
console.log(`API Base URL: ${BASE_URL}`);

// Export the base URL for use in other parts of your application
export { BASE_URL };
