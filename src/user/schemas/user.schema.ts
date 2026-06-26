import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TravelerType, LaneType } from '../enums/favorite.enums';

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
        travelerType: {
          type: String,
          required: true,
          enum: Object.values(TravelerType),
        },
        laneType: {
          type: String,
          required: true,
          enum: Object.values(LaneType),
        },
      },
    ],
    default: [],
  })
  favorites: {
    _id: mongoose.Types.ObjectId;
    crossingId: mongoose.Schema.Types.ObjectId;
    travelerType: string;
    laneType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
