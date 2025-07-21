import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Nome do moderador', example: 'Alice' })
  @IsString()
  @Length(1, 50)
  readonly moderator: string;
}
