import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/_variables.scss";
                        @import "./src/assets/scss/_reset.scss";
                        @import "./src/assets/scss/_mixins.scss";
                        @import "./src/assets/scss/index.scss";`
      }
    }
  }
})
