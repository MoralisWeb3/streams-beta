import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Moralis from 'moralis';

dotenv.config();

async function bootstrap() {
  await Moralis.start({ apiKey: process.env.API_KEY });
  const history = await Moralis.Streams.getHistory({ limit: 100 });
  const list = history.toJSON();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
