import { Test, TestingModule } from '@nestjs/testing';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';

describe('CsvController', () => {
  let controller: CsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvController],
      providers: [CsvService],
    }).compile();

    controller = module.get<CsvController>(CsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error if file is not a csv');
});
