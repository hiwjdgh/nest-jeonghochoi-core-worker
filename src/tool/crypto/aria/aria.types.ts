export type AriaCipher = 'aria-128-cbc' | 'aria-192-cbc' | 'aria-256-cbc';

export interface AriaOptions {
    /**
     * openssl 실행 파일 경로 (기본: "openssl")
     * 윈도우면 "C:\\OpenSSL-Win64\\bin\\openssl.exe" 같은 걸 넣을 수 있음
     */
    opensslPath?: string;

    /**
     * OpenSSL 3.x에서 legacy provider가 필요한 경우 true
     * (환경에 따라 aria가 legacy로 분류되어 -provider legacy 필요할 수 있음)
     */
    useLegacyProvider?: boolean;

    /**
     * OpenSSL 3.x provider path가 필요할 때 지정
     * 예: "/usr/lib/x86_64-linux-gnu/ossl-modules"
     */
    providerPath?: string;

    /**
     * cipher 알고리즘 (기본 aria-256-cbc)
     */
    cipher?: AriaCipher;

    /**
     * 입력/출력 인코딩
     */
    inputEncoding?: 'utf8' | 'base64' | 'hex';
    outputEncoding?: 'base64' | 'hex';
}
