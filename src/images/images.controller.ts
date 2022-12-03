import { zIdParam } from './../common/types/z.schema';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ImagesService } from './images.service';
import { throw400IfInvalid } from '../common/utils/validation-utils';
import { WHITELISTED_MIMES } from '../common/types/z-image.schema';

@ApiTags('image')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiOkResponse({
    type: StreamableFile,
    description: 'The following product image was found.',
  })
  @ApiProduces(...WHITELISTED_MIMES)
  @Get('products/:id')
  findOneForProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.imagesService.findOneForProduct(id, res);
  }

  @ApiOkResponse({
    type: StreamableFile,
    description: 'The following category image was found.',
  })
  @ApiProduces(...WHITELISTED_MIMES)
  @Get('categories/:id')
  async findOneForCategory(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.imagesService.findOneForCategory(id, res);
  }
}
