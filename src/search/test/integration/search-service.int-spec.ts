import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/common/services/prisma.service';
import { SearchService } from 'src/search/search.service';

describe('SearchService (Integration', () => {
  let prismaService: PrismaService;
  let service: SearchService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });
});
