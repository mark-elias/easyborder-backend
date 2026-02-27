import { Module } from '@nestjs/common';
import { WaitTime, WaitTimeSchema } from 'src/wait-time/wait-time.schema';
import { Crossing, CrossingSchema } from 'src/crossing/crossing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CbpController } from './cbp.controller';
import { CbpService } from './cbp.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: WaitTime.name, schema: WaitTimeSchema },
      { name: Crossing.name, schema: CrossingSchema },
    ]),
  ],
  providers: [CbpService],
  exports: [CbpService],
  controllers: [CbpController],
})
export class CbpModule {}
