import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id , available: true},
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id)
    
    return this.product.update({
      where: { id },
      data: updateProductDto
    })
  }
  
  async remove(id: number) { 
    
    await this.findOne(id)

    // return this.product.delete({
    //   where: { id }
    // }) // Problema de integracion referencial, NO ELIMINAR mejor trabajar con un soft delete
    const product =  await this.product.update({
      where: { id },
      data:{
        available: false
      }
    })
    return product
  }
}
