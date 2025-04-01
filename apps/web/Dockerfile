# Node.js 환경 설정
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 후 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드 후 실행
RUN npm run build
CMD ["npm", "run", "start"]
