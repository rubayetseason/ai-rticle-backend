import OpenAI from 'openai';
import config from '../config';

export const openai = new OpenAI({
  baseURL: config.openai.base_url,
  apiKey: config.openai.api_key,
  defaultHeaders: {
    'HTTP-Referer': config.openai.site_url,
    'X-Title': config.openai.site_name,
  },
});
