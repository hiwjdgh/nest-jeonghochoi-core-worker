# @jeonghochoi/core-worker

NestJS 기반 **Worker / Batch / Scheduler 서비스**에서 공통으로 사용하는  
인프라 레벨 모듈들을 모아둔 패키지입니다.

DB, HTTP, Mail, Logger, Crypto, File 처리 등  
워커 전반에서 반복적으로 필요한 기능을 **일관된 인터페이스**로 제공합니다.

> 이 패키지는 **비즈니스 로직을 포함하지 않습니다.**  
> 워커 인프라 표준화 및 중복 코드 제거를 목적으로 합니다.

---

## ✨ Features

-   ✅ Worker 공통 인프라 모듈 제공
-   ✅ 다중 DB(MySQL / PostgreSQL / MSSQL) 지원
-   ✅ HTTP Client + Retry 공통화
-   ✅ 메일(SMTP / SES) 전송 추상화
-   ✅ 파일 업로드(S3 / FTP / Local) 유틸
-   ✅ Excel / CSV 대용량 파일 처리
-   ✅ 암·복호화 및 범용 유틸
-   ✅ tsup 기반 ESM 패키징

---

## 📦 Installation

```bash
npm install @jeonghochoi/core-worker
# or
yarn add @jeonghochoi/core-worker
```

> ⚠️ NestJS Worker 환경을 전제로 합니다.

---

## 📁 Project Structure

```
src
├─ core
│  ├─ config        # 환경 변수 / 설정 관리
│  ├─ database      # DB 어댑터 (mysql, pg, mssql)
│  ├─ http          # HTTP Client (axios 기반)
│  ├─ logger        # Pino 기반 로거
│  ├─ mail          # Mail (SMTP / SES)
│  └─ index.ts
│
├─ tool
│  ├─ crypto        # 암·복호화 / 해시 유틸
│  ├─ file          # 파일 처리 / 업로드
│  ├─ tool          # 범용 유틸
│  └─ index.ts
│
└─ index.ts         # Public entry
```

---

## 🔗 Peer Dependencies

이 패키지는 아래 패키지를 **호스트 프로젝트에서 직접 설치**해야 합니다.

```json
{
    "@nestjs/common": "^10 || ^11",
    "@nestjs/config": "^3 || ^4"
}
```

> NestJS 메이저 버전에 직접 종속되지 않도록  
> peerDependencies로 분리되어 있습니다.

---

## 📚 Included Dependencies

### Database

-   `mysql2`
-   `pg`
-   `mssql`

### HTTP

-   `axios`
-   `axios-retry`
-   `rxjs`

### Mail

-   `nodemailer`
-   `handlebars`
-   `@aws-sdk/client-ses`

### File / Storage

-   `exceljs`
-   `csv-stringify`
-   `basic-ftp`
-   `@aws-sdk/client-s3`

### Logging / Validation

-   `pino`
-   `zod`

---

## 🚀 Usage (패키지 사용하는 쪽에서 선언/사용하기)

이 패키지는 **단일 엔트리포인트**(`@jeonghochoi/core-worker`)를 통해 export 됩니다.

```ts
import { CoreConfigModule, LoggerModule } from '@jeonghochoi/core-worker';
```

> `@jeonghochoi/core-worker/tool` 같은 서브패스 import는 `exports`에 열려있지 않으므로,
> 항상 루트 경로(`@jeonghochoi/core-worker`)에서 import 해야 합니다.

### 1) 호스트 프로젝트에서 의존성 선언

```bash
npm install @jeonghochoi/core-worker @nestjs/common @nestjs/config zod
```

### 2) AppModule에서 CoreConfigModule + 인프라 모듈 선언

```ts
import { Module } from '@nestjs/common';
import { z } from 'zod';
import {
    CoreConfigModule,
    DatabaseConfigSchema,
    DatabaseModule,
    HttpModule,
    loadEnv,
    LoggerConfigSchema,
    LoggerModule,
    MailModule,
    SmtpConfigSchema,
} from '@jeonghochoi/core-worker';

const WorkerConfigSchema = z.object({
    logger: LoggerConfigSchema,
    database: DatabaseConfigSchema,
    smtp: SmtpConfigSchema,
    mailTemplateDir: z.string(),
});

@Module({
    imports: [
        CoreConfigModule.forRoot({
            schema: WorkerConfigSchema,
            load: loadEnv,
        }),
        LoggerModule,
        HttpModule,
        DatabaseModule,
        MailModule,
    ],
})
export class AppModule {}
```

### 3) 서비스에서 주입받아 사용

```ts
import { Injectable } from '@nestjs/common';
import {
    DatabaseAdapterRegistry,
    HttpClient,
    MailService,
    WorkerLogger,
} from '@jeonghochoi/core-worker';

@Injectable()
export class BatchJob {
    constructor(
        private readonly logger: WorkerLogger,
        private readonly httpClient: HttpClient,
        private readonly dbRegistry: DatabaseAdapterRegistry,
        private readonly mailService: MailService
    ) {}

    async run() {
        this.logger.log('batch started');

        // HTTP
        this.httpClient.register('partner', {
            baseURL: 'https://api.example.com',
            timeoutMs: 5000,
            retries: 3,
        });
        const health = await this.httpClient.use('partner').get('/health');

        // DB
        const db = await this.dbRegistry.getConnection('main');
        await db.query('select 1');

        // Mail
        await this.mailService.send('smtp', 'job-finished', { ok: true }, {
            to: 'ops@example.com',
            subject: 'Batch done',
        });

        this.logger.log(`health: ${health.status}`);
    }
}
```

### 4) 유틸 함수 사용

```ts
import { Codec, Hash, Tool } from '@jeonghochoi/core-worker';

const base64 = Codec.toBase64('worker');
const sha = Hash.sha256('payload');
const txId = Tool.unique.txId();
```

---

## 🛠 Build

```bash
npm run build
```

-   `tsup` 기반 빌드
-   ESM 패키지
-   결과물은 `dist/` 디렉토리에 생성됩니다.

---

## 📐 Design Principles

-   **Worker 친화적 구조**
-   Stateless 설계 지향
-   비즈니스 로직 배제
-   인프라 코드의 재사용성과 일관성 우선
-   API 서버보다 **Batch / Queue / Scheduler** 사용을 전제로 설계

---

## ⚠️ Notes

-   API 서버에서도 사용은 가능하지만 일부 모듈은 워커 기준으로 설계됨
-   장기 실행 프로세스(daemon) 환경을 고려하여 작성됨
-   Windows / Linux 환경 모두 대응

---

## 📄 License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction...

```

```
