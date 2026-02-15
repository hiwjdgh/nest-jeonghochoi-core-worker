import { CoreConfigService } from '../../../core/config/config.service.js';
import { FtpConfig } from '../../../core/config/schemas/uploader.ftp.schema.js';
import { S3Config } from '../../../core/config/schemas/uploader.s3.schema.js';
import { S3Uploader } from './s3.uploader.js';
import { FtpUploader } from './ftp.uploader.js';

interface UploaderFactoryConfig {
    s3: S3Config;
    ftp: FtpConfig;
}

export class UploaderFactory {
    constructor(private readonly config: CoreConfigService<UploaderFactoryConfig>) {}

    createS3() {
        return new S3Uploader(this.config.get().s3);
    }

    createFtp() {
        return new FtpUploader(this.config.get().ftp);
    }
}
