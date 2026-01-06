import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/payment-card-input.js'),
      name: 'PaymentCardInput',
      fileName: (format) => `payment-card-input.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        assetFileNames: 'payment-card-input.[ext]'
      }
    }
  }
});
