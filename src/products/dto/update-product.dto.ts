import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { PartialType } from '@nestjs/swagger';
import { product } from '../../common/types/z.schema';
import { zProductCreateObj } from './create-product.dto';

export const zUpdateProductScalars = extendApi(
  zProductCreateObj.omit({
    highlight: true,
  }),
  {
    description: `The schema for the ${product} update`,
  },
);

class ProductScalars extends createZodDto(zUpdateProductScalars) {}

export class UpdateProductDto extends PartialType(ProductScalars) {}
