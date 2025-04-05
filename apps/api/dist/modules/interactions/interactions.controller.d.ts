import { InteractionsService } from "./interactions.service";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
export declare class InteractionsController {
    private readonly interactionsService;
    private readonly logger;
    constructor(interactionsService: InteractionsService);
    create(createInteractionDto: CreateInteractionDto): Promise<import("./interactions.entity").Interaction>;
    findAll(customerId: string): Promise<import("./interactions.entity").Interaction[]>;
    findOne(id: string): Promise<import("./interactions.entity").Interaction>;
    update(id: string, updateInteractionDto: UpdateInteractionDto): Promise<import("./interactions.entity").Interaction>;
    remove(id: string): Promise<void>;
}
