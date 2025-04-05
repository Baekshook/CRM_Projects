import { Repository } from "typeorm";
import { Interaction } from "./interactions.entity";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
export declare class InteractionsService {
    private interactionRepository;
    constructor(interactionRepository: Repository<Interaction>);
    create(createInteractionDto: CreateInteractionDto): Promise<Interaction>;
    findAll(): Promise<Interaction[]>;
    findByCustomerId(customerId: string): Promise<Interaction[]>;
    findOne(id: string): Promise<Interaction>;
    update(id: string, updateInteractionDto: UpdateInteractionDto): Promise<Interaction>;
    remove(id: string): Promise<void>;
}
