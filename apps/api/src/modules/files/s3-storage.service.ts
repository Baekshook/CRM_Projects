import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>(
          "AWS_SECRET_ACCESS_KEY"
        ),
      },
    });
    this.bucket = this.configService.get<string>("AWS_S3_BUCKET");
  }

  async uploadFile(
    fileKey: string,
    fileBuffer: Buffer,
    mimetype: string
  ): Promise<string> {
    try {
      const uploadParams = {
        Bucket: this.bucket,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));
      const fileUrl = `${this.configService.get("AWS_S3_URL")}/${fileKey}`;

      console.log(`파일이 S3에 업로드되었습니다: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      console.error("S3 파일 업로드 오류:", error);
      throw error;
    }
  }

  async getFileBuffer(fileKey: string): Promise<Buffer> {
    try {
      const getParams = {
        Bucket: this.bucket,
        Key: fileKey,
      };

      const response = await this.s3Client.send(
        new GetObjectCommand(getParams)
      );
      if (!response.Body) {
        throw new Error("파일 본문이 없습니다");
      }

      // 스트림을 버퍼로 변환
      const chunks = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error("S3 파일 다운로드 오류:", error);
      throw error;
    }
  }

  async getPresignedUrl(
    fileKey: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error("S3 Presigned URL 생성 오류:", error);
      throw error;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const deleteParams = {
        Bucket: this.bucket,
        Key: fileKey,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log(`파일이 S3에서 삭제되었습니다: ${fileKey}`);
    } catch (error) {
      console.error("S3 파일 삭제 오류:", error);
      throw error;
    }
  }
}
