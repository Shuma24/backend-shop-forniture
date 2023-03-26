import { AppModule } from './containers/App-containter';
import { TOKENS } from './containers/Symbols';
import multipart from '@fastify/multipart';
import formBody from '@fastify/formbody';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import * as dotenv from 'dotenv';
dotenv.config();

const boostApp = () => {
  const app = new AppModule();

  app.get(TOKENS.App).cors({
    origin: '*',
    credentials: true,
  });

  app.get(TOKENS.App).registerSync(cookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    },
  } as FastifyCookieOptions);

  app.get(TOKENS.App).registerSync(multipart, { addToBody: true });
  app.get(TOKENS.App).registerSync(formBody);

  app.get(TOKENS.App).init();
};

try {
  boostApp();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
