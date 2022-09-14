// create a guard that verifies the signature which is in the header x-signature
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { sha3 } from 'web3-utils';

@Injectable()
export class VerifySignature implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];
    const body = request.body;
    if (!signature) return false;
    const hash = sha3(JSON.stringify(body) + process.env.SECRET_KEY);
    return signature === hash;
  }
}
