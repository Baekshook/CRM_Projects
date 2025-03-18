# Node.js 환경 설정
FROM node:18-alpine As development

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# NestJS 빌드 후 실행
RUN npm run build

FROM node:18-alpine As production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main"]
