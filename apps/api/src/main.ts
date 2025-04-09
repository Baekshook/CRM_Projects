import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { DataSource } from "typeorm";

async function bootstrap() {
  try {
    

    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
      origin:
        process.env.FRONTEND_URL || "https://crm-project-tau-ashen.vercel.app/",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    });

    // 요청 본문 크기 제한 설정
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

    // 로깅 미들웨어 추가
    app.use((req, res, next) => {
      const startTime = Date.now();
      const { method, path } = req;

      // 파일 업로드 요청인 경우에만 자세한 로깅
      if (path.includes("/files/") && (method === "POST" || method === "PUT")) {
        console.log(
          `[${new Date().toISOString()}] ${method} ${path} 요청 시작`
        );
        console.log(`Content-Type: ${req.headers["content-type"]}`);
        if (req.headers["content-length"]) {
          console.log(
            `Content-Length: ${req.headers["content-length"]} 바이트`
          );
        }
      }

      res.on("finish", () => {
        const duration = Date.now() - startTime;
        if (
          path.includes("/files/") &&
          (method === "POST" || method === "PUT")
        ) {
          console.log(
            `[${new Date().toISOString()}] ${method} ${path} 응답 완료 - ${res.statusCode} (${duration}ms)`
          );
        }
      });

      next();
    });

    // 유효성 검증 파이프 설정
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      })
    );

    // 데이터베이스 마이그레이션 실행
    try {
      const dataSource = app.get(DataSource);
      if (dataSource.isInitialized) {
        await dataSource.runMigrations();
        console.log("마이그레이션이 성공적으로 실행되었습니다.");
      }
    } catch (err) {
      console.error("마이그레이션 실행 중 오류 발생:", err);
    }

    // API 프리픽스 설정
    app.setGlobalPrefix("api");

    // 앱 실행
    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
    console.log(`API 엔드포인트: http://localhost:${port}/api`);
  } catch (error) {
    console.error("애플리케이션 시작 중 오류 발생:", error);
  }
}

bootstrap();
