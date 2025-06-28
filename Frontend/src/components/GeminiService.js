import axios from 'axios';

export const fetchResourcesFromGemini = async (topic, description) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/gemini-resources`, {
      topic,
      description,
    });

    let raw = res.data.resources || [];

    // Handle the case where Gemini returns a stringified JSON
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        console.warn('Parsing failed:', e);
        return [];
      }
    }

    // Return only valid entries
    const filtered = raw.filter(item => item.title && item.summary);
    return filtered;
  } catch (err) {
    console.error('Gemini fetch error:', err.message);
    return [];
  }
};
