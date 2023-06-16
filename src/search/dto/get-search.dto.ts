import { createZodDto } from '@anatine/zod-nestjs';
import { getSearchCategoryDto } from 'src/categories/dto/search-category.dto';
import { getSearchProductDto } from 'src/products/dto/get-search-product.dto';
import { z } from 'zod';

export const getSearchDto = z.object({
  products: z.array(getSearchProductDto.omit({ highlight: true })),
  categories: z.array(getSearchCategoryDto),
});

export class GetSearchDto extends createZodDto(getSearchDto) {}
