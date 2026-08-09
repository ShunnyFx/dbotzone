/**
 * External API Service
 * Integration with various public APIs
 */

import axios from 'axios';

const API_CLIENTS = {
  // JokeAPI - Get random jokes
  joke: axios.create({
    baseURL: 'https://v2.jokeapi.dev',
    timeout: 5000,
  }),

  // Open Weather API - Weather data (free tier)
  weather: axios.create({
    baseURL: 'https://api.open-meteo.com',
    timeout: 5000,
  }),

  // REST Countries - Country information
  countries: axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: 5000,
  }),

  // Random User API - Random user data
  randomUser: axios.create({
    baseURL: 'https://randomuser.me/api',
    timeout: 5000,
  }),

  // Cat Facts API - Random cat facts
  catFacts: axios.create({
    baseURL: 'https://catfact.ninja',
    timeout: 5000,
  }),

  // Dog API - Random dog images and facts
  dogs: axios.create({
    baseURL: 'https://dog.ceo/api',
    timeout: 5000,
  }),
};

export const externalApiService = {
  // ============ JOKES ============
  async getRandomJoke(category: string = 'Any') {
    const response = await API_CLIENTS.joke.get(`/joke/${category}?format=json`);
    return response.data;
  },

  async getJokeByType(type: 'single' | 'twopart' = 'Any') {
    const response = await API_CLIENTS.joke.get(`/joke/Any?type=${type}&format=json`);
    return response.data;
  },

  async getJokeCategories() {
    // Returns available categories: Any, Misc, Programming, Knock-knock, General
    return ['Any', 'Misc', 'Programming', 'Knock-knock', 'General'];
  },

  // ============ WEATHER ============
  async getWeather(latitude: number, longitude: number) {
    const response = await API_CLIENTS.weather.get(
      `/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
    );
    return response.data;
  },

  // ============ COUNTRIES ============
  async getRandomCountry() {
    const response = await API_CLIENTS.countries.get('/all');
    const countries = response.data;
    return countries[Math.floor(Math.random() * countries.length)];
  },

  async getCountryByName(name: string) {
    const response = await API_CLIENTS.countries.get(`/name/${name}`);
    return response.data[0];
  },

  // ============ RANDOM USER ============
  async getRandomUser() {
    const response = await API_CLIENTS.randomUser.get('/?results=1&nat=us');
    return response.data.results[0];
  },

  async getRandomUsers(count: number = 5) {
    const response = await API_CLIENTS.randomUser.get(`/?results=${Math.min(count, 5000)}`);
    return response.data.results;
  },

  // ============ CAT FACTS ============
  async getRandomCatFact() {
    const response = await API_CLIENTS.catFacts.get('/fact');
    return response.data;
  },

  async getCatFact(maxLength: number = 200) {
    const response = await API_CLIENTS.catFacts.get(`/fact?max_length=${maxLength}`);
    return response.data;
  },

  // ============ DOGS ============
  async getRandomDogImage() {
    const response = await API_CLIENTS.dogs.get('/breeds/image/random');
    return response.data;
  },

  async getRandomDogImages(count: number = 5) {
    const response = await API_CLIENTS.dogs.get(`/breeds/image/random/${Math.min(count, 50)}`);
    return response.data;
  },

  async getDogBreeds() {
    const response = await API_CLIENTS.dogs.get('/breeds/list/all');
    return response.data;
  },

  async getBreedImages(breed: string) {
    const response = await API_CLIENTS.dogs.get(`/breed/${breed}/images`);
    return response.data;
  },

  // ============ ERROR HANDLING ============
  async handleApiError(error: any): Promise<string> {
    if (error.response) {
      return `API Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      return 'No response from server';
    } else {
      return error.message || 'An unknown error occurred';
    }
  },
};