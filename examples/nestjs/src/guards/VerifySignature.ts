import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import Moralis from 'moralis';

@Injectable()
export class VerifySignature implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];
    const body = request.body;
    console.log(body, signature);
    Moralis.Streams.verifySignature({
      signature,
      body,
    });
    return true;
  }
}
