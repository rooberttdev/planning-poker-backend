import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({
    description: 'ID da sala',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  readonly roomId: string;

  @ApiProperty({ description: 'Nome do participante', example: 'Bob' })
  @IsString()
  @Length(1, 50)
  readonly participant: string;
}
