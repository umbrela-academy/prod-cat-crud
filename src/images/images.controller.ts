import { zIdParam } from './../common/types/z.schema';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ImagesService } from './images.service';
import { complainIfInvalid } from '../common/utils/validation-utils';

@ApiTags('image')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get('products/:id')
  findOneForProduct(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    complainIfInvalid(() => zIdParam().parse(+id));
    return this.imagesService.findOneForProduct(+id, res);
  }

  @Get('categories/:id')
  findOneForCategory(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    complainIfInvalid(() => zIdParam().parse(+id));
    return this.imagesService.findOneForCategory(+id, res);
  }
}
