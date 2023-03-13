import { IAWSUploadResponse } from '../../product/interfaces/images-aws-upload.interface';
import { inputFiles } from '../../product/interfaces/product-service.interface';

export interface IStorage {
  handleFile(file: inputFiles): Promise<IAWSUploadResponse | undefined>;
}
