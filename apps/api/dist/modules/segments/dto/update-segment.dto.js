"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSegmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_segment_dto_1 = require("./create-segment.dto");
class UpdateSegmentDto extends (0, mapped_types_1.PartialType)(create_segment_dto_1.CreateSegmentDto) {
}
exports.UpdateSegmentDto = UpdateSegmentDto;
//# sourceMappingURL=update-segment.dto.js.map