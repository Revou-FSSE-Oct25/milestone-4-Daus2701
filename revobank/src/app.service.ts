import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'RevoBank API is running 🚀';
  }

  getHealth(): string {
    return 'OK';
  }
}
