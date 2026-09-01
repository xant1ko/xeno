import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: process.env.OPENAPI_INPUT ?? '../web/openapi.json',
  output: {
    path: 'src/types/generated',
    clean: true,
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@hey-api/client-axios',
  ],
})
