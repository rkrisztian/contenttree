import { ApiProperty } from '@nestjs/swagger';

export class LoginRespDto {
  @ApiProperty({
    required: true,
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJNQU5BR0VSIn0.abcdefghijklmnop',
  })
  token: string;
}
