import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! 🐳 my app is now Dockerized!! ✅ Github actions is setup ';
  }
}
