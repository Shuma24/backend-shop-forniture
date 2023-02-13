import { AppModule } from './containers/App-containter';
import { TOKENS } from './containers/Symbols';

const boostApp = () => {
  const app = new AppModule();
  app.get(TOKENS.App).init();
  app.get(TOKENS.App).cors({
    origin: '*',
    credentials: true,
  });
};

try {
  boostApp();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
