import { spawn } from 'node:child_process';
import type { AriaCipher, AriaOptions } from './aria.types.js';

function runOpenSsl(
    opensslPath: string,
    args: string[],
    input: Buffer
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const child = spawn(opensslPath, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];

        child.stdout.on('data', (d) => stdout.push(d));
        child.stderr.on('data', (d) => stderr.push(d));

        child.on('error', reject);

        child.on('close', (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `openssl exited with code ${code}: ${Buffer.concat(
                            stderr
                        ).toString()}`
                    )
                );
                return;
            }
            resolve(Buffer.concat(stdout));
        });

        child.stdin.write(input);
        child.stdin.end();
    });
}

function providerArgs(opts: AriaOptions): string[] {
    const args: string[] = [];
    if (opts.providerPath) {
        args.push('-provider-path', opts.providerPath);
    }
    if (opts.useLegacyProvider) {
        args.push('-provider', 'legacy', '-provider', 'default');
    }
    return args;
}

function validate(cipher: AriaCipher, key: Buffer, iv: Buffer) {
    const keyLen =
        cipher === 'aria-128-cbc' ? 16 : cipher === 'aria-192-cbc' ? 24 : 32;

    if (key.length !== keyLen) {
        throw new Error(`ARIA key must be ${keyLen} bytes`);
    }
    if (iv.length !== 16) {
        throw new Error('ARIA-CBC IV must be 16 bytes');
    }
}

export class AriaUtil {
    static async encrypt(
        plain: string,
        key: Buffer,
        iv: Buffer,
        opts: AriaOptions = {}
    ): Promise<string> {
        const cipher = opts.cipher ?? 'aria-256-cbc';
        validate(cipher, key, iv);

        const openssl = opts.opensslPath ?? 'openssl';
        const inputEnc = opts.inputEncoding ?? 'utf8';
        const outputEnc = opts.outputEncoding ?? 'base64';

        const args = [
            'enc',
            `-${cipher}`,
            '-e',
            '-K',
            key.toString('hex'),
            '-iv',
            iv.toString('hex'),
            ...providerArgs(opts),
            ...(outputEnc === 'base64' ? ['-a', '-A'] : []),
        ];

        const input = Buffer.from(plain, inputEnc);
        const out = await runOpenSsl(openssl, args, input);

        return outputEnc === 'base64'
            ? out.toString('utf8').trim()
            : out.toString('hex');
    }

    static async decrypt(
        cipherText: string,
        key: Buffer,
        iv: Buffer,
        opts: AriaOptions = {}
    ): Promise<string> {
        const cipher = opts.cipher ?? 'aria-256-cbc';
        validate(cipher, key, iv);

        const openssl = opts.opensslPath ?? 'openssl';
        const inputEnc = opts.outputEncoding ?? 'base64';

        const args = [
            'enc',
            `-${cipher}`,
            '-d',
            '-K',
            key.toString('hex'),
            '-iv',
            iv.toString('hex'),
            ...providerArgs(opts),
            ...(inputEnc === 'base64' ? ['-a'] : []),
        ];

        const input = Buffer.from(cipherText, inputEnc);
        const out = await runOpenSsl(openssl, args, input);

        return out.toString('utf8');
    }
}
