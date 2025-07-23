import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Alice' })
  moderator: string;

  @ApiProperty({ type: [String], description: 'Lista de participantes' })
  participants: string[];

  @ApiProperty({ required: false, example: 'Sprint Planning' })
  name?: string;
}
