import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';


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

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    })

    if (!product) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return product;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id)

    return this.product.update({
      where: { id },
      data: data
    })
  }

  async remove(id: number) {

    await this.findOne(id)

    // return this.product.delete({
    //   where: { id }
    // }) // Problema de integracion referencial, NO ELIMINAR mejor trabajar con un soft delete
    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    })
    return product
  }

  async validateProduct(ids: number[]) {

    ids = Array.from(new Set(ids)); // Eliminar duplicados

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'No product ids provided',
        status: HttpStatus.BAD_REQUEST
      })
    }
    return products;
  }
}
