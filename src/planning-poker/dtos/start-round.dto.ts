import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, IsOptional } from 'class-validator';

export class StartRoundDto {
  @ApiProperty({ description: 'ID da sala', example: 'UUID' })
  @IsUUID()
  readonly roomId: string;

  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar login',
  })
  @IsString()
  @Length(1, 100)
  readonly title: string;

  @ApiProperty({
    description: 'Descrição da tarefa',
    required: false,
    example: 'Tela de login com Firebase Auth',
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  readonly description?: string;
}
