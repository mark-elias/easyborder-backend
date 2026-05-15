import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Crossing extends Document {
  // cbp api fields
  @Prop({ required: true, unique: true })
  portNumber: string;
  @Prop({ required: true })
  portName: string;
  @Prop()
  crossingName: string;

  // origin fields
  @Prop({ required: true })
  originCountry: string; // country code
  @Prop({ required: true })
  originCity: string;

  // destination fields
  @Prop({ required: true })
  destinationCity: string;

  // operational info
  @Prop()
  portStatus: string;
  @Prop()
  hours: string;
  @Prop()
  constructionNotice: string;

  // CBPs last update timestamp (from their API)
  @Prop()
  cbpLastUpdateDate: string;
  @Prop()
  cbpLastUpdateTime: string;
}

export const CrossingSchema = SchemaFactory.createForClass(Crossing);

// indexing
CrossingSchema.index({ portNumber: 1 });
CrossingSchema.index({ originCountry: 1, originCity: 1 });
