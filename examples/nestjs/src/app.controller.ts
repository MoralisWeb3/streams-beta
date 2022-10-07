import { Types as StreamsTypes } from '@moralisweb3/streams';
import { AppService } from './app.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VerifySignature } from './guards/VerifySignature';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(VerifySignature)
  @Post('stream')
  walletEvent(@Body() body: StreamsTypes.IWebhook) {
    return this.appService.handleStream(body);
  }
}
