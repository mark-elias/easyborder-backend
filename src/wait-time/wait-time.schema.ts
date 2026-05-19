import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Crossing } from 'src/crossing/crossing.schema';

@Schema({ timestamps: true })
export class WaitTime extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crossing',
    required: true,
  })
  crossing: Crossing;

  // @Prop({ required: true })
  // portNumber: string;

  // @Prop({ default: true })
  // isCurrent: boolean;

  // Commercial lanes
  @Prop({ type: Object })
  commercial: {
    standard: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
    fast: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
  };

  // passenger lanes
  @Prop({ type: Object })
  passenger: {
    standard: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
    sentri: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
    ready: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
  };

  // Pedestrian Lanes
  @Prop({ type: Object })
  pedestrian: {
    standard: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
    ready: {
      updateTime: string;
      operationalStatus: string;
      delayMinutes: number;
      lanesOpen: number;
    };
  };
}

export const WaitTimeSchema = SchemaFactory.createForClass(WaitTime);

// indexing
WaitTimeSchema.index({ crossing: 1 });
