import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import Moralis from 'moralis';

dotenv.config();

async function getErrorAndRestart() {
  const rawAll = await Moralis.Streams.getAll({ network: 'evm', limit: 100 });
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
      network: 'evm',
    });
  } catch (error) {
    console.log('couldnt restart stream', id);
  }
}

async function bootstrap() {
  await Moralis.start({ apiKey: process.env.API_KEY });
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: '5mb' }));
  await app.listen(process.env.PORT || 8080);

  try {
    getErrorAndRestart();
  } catch (error) {
    console.log('couldnt restart stopped streams');
  }
}

bootstrap();
