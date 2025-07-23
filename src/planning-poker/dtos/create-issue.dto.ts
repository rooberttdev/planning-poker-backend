import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

export class CreateIssueDto {
  @ApiProperty({ example: 'Implementar login' })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({ example: 'Tela de login com Firebase Auth', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
