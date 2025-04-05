import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Interaction } from "./interactions.entity";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>
  ) {}

  async create(
    createInteractionDto: CreateInteractionDto
  ): Promise<Interaction> {
    const interaction = this.interactionRepository.create(createInteractionDto);
    return this.interactionRepository.save(interaction);
  }

  async findAll(): Promise<Interaction[]> {
    return this.interactionRepository.find({
      relations: ["customer"],
    });
  }

  async findByCustomerId(customerId: string): Promise<Interaction[]> {
    return this.interactionRepository.find({
      where: { customerId },
      relations: ["customer"],
    });
  }

  async findOne(id: string): Promise<Interaction> {
    const interaction = await this.interactionRepository.findOne({
      where: { id },
      relations: ["customer"],
    });

    if (!interaction) {
      throw new NotFoundException(`Interaction with ID "${id}" not found`);
    }

    return interaction;
  }

  async update(
    id: string,
    updateInteractionDto: UpdateInteractionDto
  ): Promise<Interaction> {
    const interaction = await this.findOne(id);
    Object.assign(interaction, updateInteractionDto);
    return this.interactionRepository.save(interaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.interactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Interaction with ID "${id}" not found`);
    }
  }
}
