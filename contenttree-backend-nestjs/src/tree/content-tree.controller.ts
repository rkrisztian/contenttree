import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Role } from '../auth/model/role.js';
import { Roles } from '../auth/roles/roles.decorator.js';
import { RolesGuard } from '../auth/roles/roles.guard.js';
import { ContentTreeMapper } from './content-tree.mapper.js';
import { ContentTreeService } from './content-tree.service.js';
import { ContentRespDto } from './dto/content-resp.dto.js';
import { CreateTreeNodeReqDTO } from './dto/create-tree-node-req.dto.js';
import { TreeNodeRespDTO } from './dto/tree-node-resp.dto.js';
import { UpdateTreeNodeReqDTO } from './dto/update-tree-node-req.dto.js';

class SearchQuery {
  @IsString()
  @MinLength(3)
  text: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/tree')
export class ContentTreeController {
  constructor(private readonly service: ContentTreeService) {}

  @Put()
  @ApiOperation({ summary: 'Creates a new node with the given name and content' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.MANAGER)
  async createNode(@Body() dto: CreateTreeNodeReqDTO): Promise<number> {
    return (await this.service.createNode(ContentTreeMapper.createDtoToTreeNodeWithContent(dto)))
      .id;
  }

  @Post()
  @ApiOperation({ summary: 'Updates an existing node with the given name and content' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.MANAGER)
  @ApiBearerAuth()
  async updateNode(@Body() dto: UpdateTreeNodeReqDTO): Promise<void> {
    await this.service.updateNode(ContentTreeMapper.updateDtoToTreeNodeWithContent(dto));
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes a node with all children recursively' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.MANAGER)
  async deleteNode(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteNode(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves all nodes without content' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.READER)
  async listTree(): Promise<TreeNodeRespDTO[]> {
    return (await this.service.getTree()).map(ContentTreeMapper.toTreeNodeRespDTO);
  }

  @Get('/content/:id')
  @ApiOperation({ summary: 'Retrieves the content of a node' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.READER)
  async getContent(@Param('id', ParseIntPipe) id: number): Promise<ContentRespDto> {
    return new ContentRespDto(await this.service.getContentById(id));
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Retrieves all nodes having a substring in name or content, ignoring case',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.READER)
  async findNode(@Query() query: SearchQuery): Promise<number[]> {
    return (await this.service.findText(query.text)).map(Number);
  }

  @Post('/move')
  @ApiOperation({ summary: 'Moves the given node under the given parent node' })
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.MANAGER)
  async moveNode(
    @Body('nodeId', ParseIntPipe) nodeId: number,
    @Body('newParentId', ParseIntPipe) newParentId: number,
  ): Promise<void> {
    await this.service.moveNode(nodeId, newParentId);
  }
}
