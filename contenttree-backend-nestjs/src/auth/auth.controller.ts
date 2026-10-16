import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginReqDto } from './dto/login-req.dto.js';
import { LoginRespDto } from './dto/login-resp.dto.js';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logs in and generates a JWT token' })
  async login(@Body() request: LoginReqDto) {
    const token = await this.service.authenticate(request.username, request.password);
    return { token } as LoginRespDto;
  }
}
