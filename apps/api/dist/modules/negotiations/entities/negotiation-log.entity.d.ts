import { Match } from "../../matches/entities/match.entity";
import { Negotiation } from "./negotiation.entity";
export declare class NegotiationLog {
    id: string;
    matchId: string;
    negotiationId: string;
    date: string;
    type: string;
    content: string;
    user: string;
    createdAt: Date;
    match: Match;
    negotiation: Negotiation;
}
