import { IsInt, IsString, MinLength } from 'class-validator';

export class UpdateTreeNodeReqDTO {
  @IsInt()
  id: number;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  content: string;
}
