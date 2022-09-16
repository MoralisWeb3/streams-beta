import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import Moralis from 'moralis';

@Injectable()
export class VerifySignature implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];
    const body = request.body;
    Moralis.Streams.verifySignature(body, signature);
    return true;
  }
}
