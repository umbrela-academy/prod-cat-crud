import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { GetSearchDto } from './dto/get-search.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOkResponse({
    type: GetSearchDto,
    description: 'The following product and categories were found',
  })
  @Get()
  async search(@Query('search') query: string) {
    return this.searchService.search(query);
  }
}
