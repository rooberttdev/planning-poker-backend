import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, IsInt, Min } from 'class-validator';

export class VoteDto {
  @ApiProperty({ description: 'ID da sala', example: 'UUID' })
  @IsUUID()
  readonly roomId: string;

  @ApiProperty({ description: 'Nome do participante', example: 'Carol' })
  @IsString()
  @Length(1, 50)
  readonly participant: string;

  @ApiProperty({ description: 'Valor da estimativa', example: 5 })
  @IsInt()
  @Min(1)
  readonly value: number;
}
