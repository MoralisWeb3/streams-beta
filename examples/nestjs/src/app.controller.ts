import { Types as StreamsTypes } from '@moralisweb3/streams';
import { AppService } from './app.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { VerifySignature } from './guards/VerifySignature';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(VerifySignature)
  @Post('wallet')
  walletEvent(@Body() body: StreamsTypes.IWebhook) {
    return this.appService.handleWalletEvent(body);
  }

  @UseGuards(VerifySignature)
  @Post('contract')
  contractEvent(@Body() body: StreamsTypes.IWebhook, @Headers() headers) {
    return this.appService.handleContractEvent(body);
  }

  @Get()
  healthCheck() {
    return { success: true };
  }
}
