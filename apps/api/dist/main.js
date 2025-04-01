"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const bodyParser = require("body-parser");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type, Accept, Authorization",
        });
        app.use(bodyParser.json({ limit: "50mb" }));
        app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
        app.use((req, res, next) => {
            const startTime = Date.now();
            const { method, path } = req;
            if (path.includes("/files/") && (method === "POST" || method === "PUT")) {
                console.log(`[${new Date().toISOString()}] ${method} ${path} 요청 시작`);
                console.log(`Content-Type: ${req.headers["content-type"]}`);
                if (req.headers["content-length"]) {
                    console.log(`Content-Length: ${req.headers["content-length"]} 바이트`);
                }
            }
            res.on("finish", () => {
                const duration = Date.now() - startTime;
                if (path.includes("/files/") &&
                    (method === "POST" || method === "PUT")) {
                    console.log(`[${new Date().toISOString()}] ${method} ${path} 응답 완료 - ${res.statusCode} (${duration}ms)`);
                }
            });
            next();
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
        }));
        try {
            const dataSource = app.get(typeorm_1.DataSource);
            if (dataSource.isInitialized) {
                await dataSource.runMigrations();
                console.log("마이그레이션이 성공적으로 실행되었습니다.");
            }
        }
        catch (err) {
            console.error("마이그레이션 실행 중 오류 발생:", err);
        }
        app.setGlobalPrefix("api");
        const port = process.env.PORT || 4000;
        await app.listen(port);
        console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
        console.log(`API 엔드포인트: http://localhost:${port}/api`);
    }
    catch (error) {
        console.error("애플리케이션 시작 중 오류 발생:", error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map