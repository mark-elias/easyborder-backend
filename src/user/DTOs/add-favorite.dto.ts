import { IsEnum, IsMongoId } from 'class-validator';

export enum LaneCategory {
  PASSENGER = 'passenger',
  PEDESTRIAN = 'pedestrian',
  COMMERCIAL = 'commercial',
}

export enum LaneType {
  STANDARD = 'standard',
  SENTRI = 'sentri',
  READY = 'ready',
  FAST = 'fast',
}

export class AddFavoriteDto {
  @IsMongoId()
  crossingId: string;

  @IsEnum(LaneCategory)
  laneCategory: LaneCategory;

  @IsEnum(LaneType)
  laneType: LaneType;
}
