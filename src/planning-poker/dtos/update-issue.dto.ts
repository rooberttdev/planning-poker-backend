import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, IsOptional } from 'class-validator';

export class UpdateIssueDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Título atualizado' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiProperty({ example: 'Descrição nova', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'voting', 'completed'],
  })
  @IsOptional()
  @IsString()
  status?: 'pending' | 'voting' | 'completed';
}
