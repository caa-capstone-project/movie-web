// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-swiper', 'nuxt-rating'],
  runtimeConfig: {
    public: {
      COGNITO_CLIENT_URL: process.env.COGNITO_CLIENT_URL,
      MOVIE_SERVICE_URL: process.env.MOVIE_SERVICE_URL,
      PREFERENCE_SERVICE_URL: process.env.PREFERENCE_SERVICE_URL,
      RATING_SERVICE_URL: process.env.RATING_SERVICE_URL,
    }
  }
})