import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  onModuleInit() {
    this.$connect()
    console.log("Database connected")
  }
  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    })
  }

  findAll(paginationDto: PaginationDto) {

    const { page = 0, limit = 0 } = paginationDto;


    return this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.product.findFirst({
      where: { id }
    })
  }


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
