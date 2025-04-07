#!/bin/bash

# 배포 스크립트 (로컬에서 실행)
echo "===== CRM 시스템 배포 스크립트 시작 ====="

# 서버 접속 정보
SERVER_USER="your-username"
SERVER_IP="your-server-ip"
SERVER_PATH="/home/$SERVER_USER/crm-project"

# 로컬 프로젝트 경로
LOCAL_PROJECT_PATH=$(pwd)

# 1. 프로젝트 파일 압축
echo "프로젝트 파일 압축 중..."
tar --exclude="node_modules" --exclude=".next" --exclude="dist" -czf crm-project.tar.gz .

# 2. 서버에 디렉토리 생성
echo "서버에 디렉토리 생성 중..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_PATH"

# 3. 압축 파일 전송
echo "파일 전송 중..."
scp crm-project.tar.gz $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# 4. 서버에서 압축 해제 및 Docker 실행
echo "서버에서 배포 작업 실행 중..."
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && \
    tar -xzf crm-project.tar.gz && \
    rm crm-project.tar.gz && \
    docker-compose down && \
    docker-compose build --no-cache && \
    docker-compose up -d"

# 5. 로컬 임시 파일 정리
echo "로컬 임시 파일 정리 중..."
rm crm-project.tar.gz

echo "===== 배포 완료 ====="
echo "애플리케이션 접속: http://$SERVER_IP:3000"
echo "API 서버 접속: http://$SERVER_IP:4000" 