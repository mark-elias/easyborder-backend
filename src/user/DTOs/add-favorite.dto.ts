import { IsEnum, IsMongoId } from 'class-validator';
import { TravelerType, LaneType } from '../enums/favorite.enums';

export { TravelerType, LaneType };

export class AddFavoriteDto {
  @IsMongoId()
  crossingId: string;

  @IsEnum(TravelerType)
  travelerType: TravelerType;

  @IsEnum(LaneType)
  laneType: LaneType;
}
