import { Match } from "../../matches/entities/match.entity";
export declare class NegotiationLog {
    id: string;
    matchId: string;
    date: string;
    type: string;
    content: string;
    user: string;
    match: Match;
}
