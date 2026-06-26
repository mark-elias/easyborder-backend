import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  // dont automatically send password when getting a user
  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  username: string;

  @Prop({
    type: [
      {
        crossingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Crossing',
          required: true,
        },
        laneCategory: { type: String, required: true },
        laneType: { type: String, required: true },
      },
    ],
    default: [],
  })
  favorites: {
    _id: mongoose.Types.ObjectId;
    crossingId: mongoose.Schema.Types.ObjectId;
    laneCategory: string;
    laneType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
