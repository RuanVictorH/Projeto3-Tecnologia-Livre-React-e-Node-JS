// backend/src/controllers/weatherController.js
const axios = require('axios');

exports.getWeatherLavras = async (req, res) => {
  try {
    // Coordenadas de Lavras, MG
    const lat = -21.2446;
    const lon = -44.9955;

    // Busca: Temperatura atual, Código do tempo (sol/chuva) e Probabilidade de chuva hoje
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`;

    const response = await axios.get(url);
    const data = response.data;

    // Mapeamento simples de códigos WMO para texto/ícone
    // Fonte: https://open-meteo.com/en/docs
    const interpretWeather = (code) => {
        if (code === 0) return { desc: 'Céu Limpo', icon: '☀️' };
        if (code >= 1 && code <= 3) return { desc: 'Parcialmente Nublado', icon: '⛅' };
        if (code >= 45 && code <= 48) return { desc: 'Nevoeiro', icon: '🌫️' };
        if (code >= 51 && code <= 67) return { desc: 'Chuva Leve/Moderada', icon: '🌧️' };
        if (code >= 80 && code <= 82) return { desc: 'Pancadas de Chuva', icon: '🌦️' };
        if (code >= 95) return { desc: 'Tempestade', icon: '⚡' };
        return { desc: 'Nublado', icon: '☁️' };
    };

    const current = data.current;
    const daily = data.daily;
    const weatherInfo = interpretWeather(current.weather_code);

    const weatherData = {
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        condition: weatherInfo.desc,
        icon: weatherInfo.icon,
        rainChance: daily.precipitation_probability_max[0], // Probabilidade máxima de hoje
        min: Math.round(daily.temperature_2m_min[0]),
        max: Math.round(daily.temperature_2m_max[0]),
        city: 'Lavras, MG'
    };

    res.json(weatherData);

  } catch (error) {
    console.error("Erro ao buscar clima:", error.message);
    res.status(500).json({ message: "Erro ao carregar clima" });
  }
};