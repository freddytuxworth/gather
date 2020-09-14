import {createHash, randomBytes} from "crypto";
import {ByteArray, FFICompatArray, FFICompatArrayType, toUUID} from "zkgroup";
import {UUID_LENGTH} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
import TypedArray = NodeJS.TypedArray;

export type SubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

export const hashString = (input: string) => createHash('sha256').update(input).digest();

export const toFFI = (b: Uint8Array) => new FFICompatArray(Buffer.from(b));

export const fromFFI = (f: FFICompatArrayType) => new Uint8Array(f.buffer);

export const construct = <T extends ByteArray, Z extends Uint8Array | { content: Uint8Array }>(v: Z,
                                                                                               C: new (a: FFICompatArrayType) => T): T =>
    v instanceof Uint8Array ? new C(toFFI(v as Uint8Array)) : new C(toFFI((v as { content: Uint8Array }).content));

export const deconstruct = <T extends ByteArray>(v: T): Uint8Array => fromFFI(v.contents);

export const maybeConstruct = <T extends ByteArray>(v: Uint8Array | { content: Uint8Array } | T,
                                                    C: new (a: FFICompatArrayType) => T): T =>
    v instanceof C ? v as T : construct(v as Uint8Array | { content: Uint8Array }, C);

export const maybeDeconstruct = <T extends ByteArray, Z extends { content: Uint8Array } | Uint8Array | T>(v: Z): Uint8Array =>
    v instanceof Uint8Array ? v as Uint8Array :
        (v as { content: Uint8Array }).content !== undefined ? (v as { content: Uint8Array }).content :
            deconstruct(v as T);

export const typedArraysEqual = (a: TypedArray, b: TypedArray) => a.byteLength == b.byteLength &&
    a.every((v: number, i: number) => b[i] == v);

export const areEqual = (a: ByteArray, b: ByteArray) => a.contents.buffer.compare(b.contents.buffer) == 0;

export const randomCompatArray = (size: number) => new FFICompatArray(randomBytes(size));

export const nowRedemptionTime = () => Math.floor(Date.now() / (60 * 60 * 24 * 1000));

export const redemptionTimeValid = (redemptionTime: number) => Math.floor(Date.now() / (60 * 60 * 1000)) ==
    redemptionTime;

export const randomUuid = () => toUUID(randomCompatArray(UUID_LENGTH));

export const usernameToUuid = (username: string) => toUUID(FFICompatArray(Buffer.from(username, 'utf-8')));
