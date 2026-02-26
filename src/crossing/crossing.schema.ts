import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Crossing extends Document {
  @Prop({ required: true, unique: true })
  portNumber: string;

  @Prop({ required: true })
  border: string;

  @Prop({ required: true })
  portName: string;

  @Prop()
  crossingName: string;

  @Prop()
  hours: string;

  @Prop()
  date: string;

  @Prop()
  time: string;

  @Prop()
  portStatus: string;

  @Prop()
  constructionNotice: string;
}

export const CrossingSchema = SchemaFactory.createForClass(Crossing);
