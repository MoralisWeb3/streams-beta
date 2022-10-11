import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import Moralis from 'moralis';

dotenv.config();

async function getErrorAndRestart() {
  const rawAll = await Moralis.Streams.getAll({ limit: 10 });
  const allStreams = rawAll.toJSON();
  const erroredStreams = allStreams.filter(({ status }) => status === 'error');
  if (erroredStreams.length > 0) {
    console.log('Errored streams found');
  }
  erroredStreams.forEach(async ({ id }) => {
    await restartStream({ id });
  });
}

async function restartStream({ id }: { id: string }) {
  try {
    await Moralis.Streams.updateStatus({
      id,
      status: 'active',
    });
  } catch (error) {
    console.log('couldnt restart stream', error.message);
  }
}

async function bootstrap() {
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: '10mb' }));
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
