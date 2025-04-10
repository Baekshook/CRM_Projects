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
        console.log("환경 변수 확인:");
        console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`PORT: ${process.env.PORT}`);
        console.log(`DB_HOST: ${process.env.DB_HOST}`);
        console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
        app.enableCors({
            origin: [
                "https://crm-project-tau-ashen.vercel.app",
                "http://localhost:3000",
                "http://localhost:4000",
            ],
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            allowedHeaders: "Content-Type, Accept, Authorization, X-Requested-With",
            credentials: true,
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
        app.use("/", (req, res) => {
            res.json({
                name: "CRM API Server",
                status: "online",
                version: "1.0.0",
                endpoints: "/api",
            });
        });
        app.use("/health", (req, res) => {
            res.json({
                status: "ok",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        });
        const port = process.env.PORT || 8080;
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