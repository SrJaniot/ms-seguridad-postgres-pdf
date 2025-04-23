import {ApplicationConfig, App} from './application';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new App(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '127.0.0.1',
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        setServersFromRequest: true,
      },
      // Enable HTTPS  sudo certbot certonly --standalone -d coco.casinosoft.com.co
      //protocol: 'https',
      //key: fs.readFileSync('/etc/letsencrypt/live/coco.casinosoft.com.co/privkey.pem'),
      //cert: fs.readFileSync('/etc/letsencrypt/live/coco.casinosoft.com.co/fullchain.pem'),
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
