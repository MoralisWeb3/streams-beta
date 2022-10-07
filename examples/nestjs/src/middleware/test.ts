import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TEST_PAYLOAD } from 'src/utils';
import * as _ from 'lodash';

/**
 * This middleware is used to intercept the initial test webhooks coming from Moralis Streams API.
 */
@Injectable()
export class TestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (_.isEqual(req.body, TEST_PAYLOAD)) {
      return res.status(200).send({ success: true });
    }
    next();
  }
}
