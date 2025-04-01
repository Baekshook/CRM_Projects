"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSingerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_singer_dto_1 = require("./create-singer.dto");
class UpdateSingerDto extends (0, mapped_types_1.PartialType)(create_singer_dto_1.CreateSingerDto) {
}
exports.UpdateSingerDto = UpdateSingerDto;
//# sourceMappingURL=update-singer.dto.js.map