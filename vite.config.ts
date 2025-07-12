import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react-swc';
// import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  // Uncomment the following lines to enable HTTPS
  // server: {
  //   https: {
  //     key: fs.readFileSync("./certs/localhost-key.pem"),
  //     cert: fs.readFileSync("./certs/localhost.pem"),
  //   }
  // }
});
