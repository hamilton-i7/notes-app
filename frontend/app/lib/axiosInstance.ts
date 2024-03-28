import ax from 'axios';

const axios = ax.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 1_000,
});

export default axios;
