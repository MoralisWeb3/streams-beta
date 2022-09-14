import { VerifySignature } from './guards/VerifySignature';
import { IWebhook } from './types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(VerifySignature)
  @Post('token')
  receiveWebhook(@Body() body: IWebhook) {
    return this.appService.handleWebhook(body);
  }
}
