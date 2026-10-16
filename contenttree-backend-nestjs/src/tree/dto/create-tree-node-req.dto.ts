import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTreeNodeReqDTO {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  content: string;

  @IsInt()
  @IsOptional()
  parentId?: number | null;
}
