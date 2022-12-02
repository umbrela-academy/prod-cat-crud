import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductHighlightsDto } from './../dto/update-product-highlights.dto';
import { ProductCommonsService } from './product-commons.service';

import { PrismaService } from '../../common/services/prisma.service';
import { UploadedFileModel } from '../../common/types/uploaded-file.model';
import { CreateHighlightDto } from '../dto/create-highlight.dto';
import { UpdatedProductHighlightsDto } from '../dto/updated-product-highlights.dto';
import { UpdatedProductImagesDto } from '../dto/updated-product-images.dto';

@Injectable()
export class ProductRelationsService {
  constructor(
    private prismaService: PrismaService,
    private productCommonsService: ProductCommonsService,
  ) {}

  async updateHighlights(
    id: number,
    highlightUpdates: UpdateProductHighlightsDto,
  ): Promise<UpdatedProductHighlightsDto[]> {
    await this.throw404IfNonExistent(id);

    const givenIdsForEdit = highlightUpdates.edit.map(
      (highlight) => highlight.id,
    );

    const getEditDescription = (highlightId: number) =>
      highlightUpdates.edit.find((editable) => editable.id === highlightId)
        ?.description;

    const givenHighlightIds = givenIdsForEdit.concat(highlightUpdates.remove);

    const foundHighlightIds = await this.prismaService.product
      .findUnique({
        where: {
          id,
        },
        include: {
          highlights: {
            where: {
              id: {
                in: givenHighlightIds,
              },
            },
            select: {
              id: true,
            },
          },
        },
      })
      .then((res) => res?.highlights.map((highlight) => highlight.id));

    if (!foundHighlightIds || foundHighlightIds.length === 0) {
      throw new NotFoundException(
        'None of the provided highlight ids were found in the product',
      );
    }

    const updatableIds = foundHighlightIds.filter((uid) =>
      givenIdsForEdit.includes(uid),
    );

    const removableIds = foundHighlightIds.filter((rid) =>
      highlightUpdates.remove.includes(rid),
    );

    if (updatableIds.length > 0) {
      const updateBatch = updatableIds.map((uid) =>
        this.prismaService.highlight.update({
          where: {
            id: uid,
          },
          data: {
            description: getEditDescription(uid),
          },
        }),
      );
      await this.prismaService.$transaction(updateBatch);
    }

    if (removableIds.length > 0) {
      await this.prismaService.highlight.deleteMany({
        where: {
          id: { in: removableIds },
        },
      });
    }

    return this.prismaService.highlight.findMany({
      where: {
        productId: id,
      },
      select: {
        id: true,
        description: true,
      },
    });
  }

  async addHighlights(
    id: number,
    highlights: CreateHighlightDto[],
  ): Promise<UpdatedProductHighlightsDto[]> {
    await this.throw404IfNonExistent(id);
    const highlightsPayload = highlights.map((highlight) => ({
      productId: id,
      description: highlight.description,
    }));

    await this.prismaService.highlight.createMany({
      data: highlightsPayload,
    });

    return this.prismaService.highlight.findMany({
      where: {
        productId: id,
      },
      select: {
        id: true,
        description: true,
      },
    });
  }

  async addImages(
    id: number,
    imageFileDtos: UploadedFileModel[],
  ): Promise<UpdatedProductImagesDto[]> {
    await this.throw404IfNonExistent(id);

    const images = this.productCommonsService.getImagesPayload(imageFileDtos);

    return this.prismaService.product
      .update({
        where: {
          id,
        },
        data: {
          images,
        },
        include: {
          images: {
            select: {
              id: true,
            },
          },
        },
      })
      .then((res) =>
        res.images.map((img) => ({
          id: img.id,
          url: this.productCommonsService.toUrl(img.id),
        })),
      );
  }

  private async throw404IfNonExistent(id: number) {
    const productExists = await this.productCommonsService.exists(id);
    if (!productExists) {
      throw new NotFoundException(`Product with id: ${id} does not exist.`);
    }
  }

  async removeHighlight(id: number, highlightId: number) {
    const productWithHighlight = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: {
        highlights: {
          where: {
            id: highlightId,
          },
        },
      },
    });

    if (productWithHighlight === null) {
      throw new NotFoundException(
        `Highlight with id: ${highlightId} was not found in product with id: ${id}`,
      );
    }

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        highlights: {
          delete: {
            id: highlightId,
          },
        },
      },
    });
  }

  removeImage(id: number, imageId: number) {
    const productWithImage = this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: {
        images: {
          where: {
            id: imageId,
          },
        },
      },
    });

    if (productWithImage === null) {
      throw new NotFoundException(
        `Image with id: ${imageId} was not found in product with id: ${id}`,
      );
    }

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        images: {
          delete: {
            id: imageId,
          },
        },
      },
    });
  }
}
