import { IsString } from 'class-validator';

export class LeaveRoomDto {
  @IsString() roomId: string;
  @IsString() participant: string;
}
