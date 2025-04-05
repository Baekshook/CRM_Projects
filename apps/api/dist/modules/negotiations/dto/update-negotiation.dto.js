"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNegotiationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_negotiation_dto_1 = require("./create-negotiation.dto");
class UpdateNegotiationDto extends (0, mapped_types_1.PartialType)(create_negotiation_dto_1.CreateNegotiationDto) {
}
exports.UpdateNegotiationDto = UpdateNegotiationDto;
//# sourceMappingURL=update-negotiation.dto.js.map