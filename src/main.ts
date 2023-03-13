import { AppModule } from './containers/App-containter';
import { TOKENS } from './containers/Symbols';
import multipart from '@fastify/multipart';
import formBody from '@fastify/formbody';

const boostApp = () => {
  const app = new AppModule();
  app.get(TOKENS.App).registerSync(multipart, { addToBody: true });
  app.get(TOKENS.App).registerSync(formBody);

  app.get(TOKENS.App).cors({
    origin: '*',
    credentials: true,
  });

  app.get(TOKENS.App).init();
};

try {
  boostApp();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
