import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react-swc';
// import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Enable the cloudflare plugin when run build
  const plugins = [react()];
  if (command === 'build') {
    plugins.push(cloudflare());
  }

  return {
    plugins,
    server: {
      // Uncomment the following lines to enable HTTPS
      // https: {
      //   key: fs.readFileSync("./certs/localhost-key.pem"),
      //   cert: fs.readFileSync("./certs/localhost.pem"),
      // }
    }
  };
});
