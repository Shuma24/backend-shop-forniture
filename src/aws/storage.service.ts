import {
  CompleteMultipartUploadCommandOutput,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

import { injected } from 'brandi';
import { IConfigService } from '../config/config.service.interface';
import { TOKENS } from '../containers/Symbols';
import { inputFiles } from '../product/interfaces/product-service.interface';
import { IStorage } from './interfaces/storage.interface';
import { v4 as uuidv4 } from 'uuid';
import { ILoggerService } from '../logger/logger.service.interface';
import { Upload } from '@aws-sdk/lib-storage';
import { IAWSUploadResponse } from '../product/interfaces/images-aws-upload.interface';

export class S3Storage implements IStorage {
  private readonly bucketName: string;
  private readonly region: string;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: IConfigService,
    private readonly logger: ILoggerService,
  ) {
    this.bucketName = configService.get('AWS_PUBLIC_BUCKET_NAME');
    this.region = configService.get('AWS_REGION');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.logger.info('S3Storage initialized');
  }

  async handleFile(file: inputFiles): Promise<IAWSUploadResponse | undefined> {
    let result = null;
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: `${uuidv4()}-${file.filename}`,
      Body: file.data,
      ContentType: file.mimetype,
    };

    try {
      const upload = new Upload({
        client: this.s3Client,
        params,
      });

      const data: CompleteMultipartUploadCommandOutput = await upload.done();

      if (!data) {
        throw new Error('S3 Upload Error');
      }

      if (data.$metadata.httpStatusCode !== 200) {
        throw new Error('S3 Upload Error');
      }

      if (data.Bucket && data.Key && data.Location) {
        result = {
          url: data.Key,
          filename: data.Location,
        };

        return result;
      } else {
        throw new Error('S3 Upload Error');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

injected(S3Storage, TOKENS.Config, TOKENS.Logger);
