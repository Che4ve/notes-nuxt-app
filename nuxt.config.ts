// https://nuxt.com/docs/api/configuration/nuxt-config

import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  components: false,
  modules: [
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@nuxt/image",
    "dayjs-nuxt",
    "nuxt-typed-router",
  ],
  fonts: {
    families: [{ name: "montserrat", provider: "google" }],
  },
  css: ["~/assets/scss/global.scss"],
  vite: {
    css: {
      preprocessorOptions : {
        scss: {
          additionalData: `
            @use "~/assets/scss/_variables.scss" as *;
            @use "~/assets/scss/_mixins.scss" as *;
          `,
        }
      }
    },
    plugins: [
        svgLoader()
    ]
  },
  app: {
    baseURL: '/notes-nuxt-app/',
    buildAssetsDir: 'assets',
  }
});