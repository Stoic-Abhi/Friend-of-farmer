import { defineConfig } from 'vite'
// import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [
//     react(),
//     babel({ presets: [reactCompilerPreset()] })
//   ],
//   base: '/'
// })
export default defineConfig({
  plugins: [react()],
  base: '/'
})