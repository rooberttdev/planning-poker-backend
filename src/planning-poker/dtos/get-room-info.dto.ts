import { IsString } from 'class-validator';

export class GetRoomInfoDto {
  @IsString()
  roomId: string;
}
