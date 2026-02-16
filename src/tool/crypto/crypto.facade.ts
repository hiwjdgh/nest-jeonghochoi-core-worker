import { Aes } from './aes/aes.js';
import { Aria } from './aria/aria.js';
import { Codec } from './codec/codec.js';
import { Hash } from './hash/hash.js';

export class Crypto {
    static aes = Aes;
    static aria = Aria;
    static codec = Codec;
    static hash = Hash;
}
