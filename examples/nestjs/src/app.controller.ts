import { VerifySignature } from './guards/VerifySignature';
import { IWebhook } from './types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(VerifySignature)
  @Post('wallet')
  walletEvent(@Body() body: IWebhook) {
    return this.appService.handleWalletEvent(body);
  }

  @UseGuards(VerifySignature)
  @Post('contract')
  contractEvent(@Body() body: IWebhook) {
    return this.appService.handleContractEvent(body);
  }
}
