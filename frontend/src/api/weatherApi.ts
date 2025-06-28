interface WeatherData {
  weather: 'sunny' | 'cloudy' | 'rainy';
  temperature: string;
}

/**
 * 天気情報を取得するAPI
 * @returns {Promise<WeatherData | null>} 天気情報
 */
export const weatherApi = {
  /**
   * 天気情報を取得する
   * @returns {Promise<WeatherData | null>} 天気情報
   */
  async fetchWeather(): Promise<WeatherData | null> {
    try {
      // OpenWeatherMap APIを使用（京都の都市ID: 1857910）
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=1857910&appid=${API_KEY}&units=metric&lang=ja`
      );

      if (!response.ok) {
        throw new Error('天気情報の取得に失敗しました');
      }

      const data = await response.json();

      // 天気状態に基づいてアイコンIDを決定
      let weatherIcon: 'sunny' | 'cloudy' | 'rainy' = 'sunny';

      // 天気状態の判定
      const weatherMain = data.weather[0].main.toLowerCase();
      if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        weatherIcon = 'rainy';
      } else if (weatherMain.includes('cloud')) {
        weatherIcon = 'cloudy';
      }

      console.log('天気情報:', {
        weather: weatherIcon,
        temperature: data.main.temp,
      });

      return {
        weather: weatherIcon,
        temperature: data.main.temp,
      };
    } catch (error) {
      console.error('天気情報の取得に失敗しました:', error);
      return null;
    }
  },
};
