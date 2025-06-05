import axios from 'axios';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const getExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return default rates in case of an error
    return {
      BRL: 5.3,
      PYG: 7300,
      USD: 1,
    };
  }
};