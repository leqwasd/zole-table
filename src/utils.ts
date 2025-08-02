import { compress as lzCompress, decompress as lzDecompress } from "lz-string";
export function compress<T>(data: T): string {
	return lzCompress(JSON.stringify(data));
}

export function decompress<T>(data: string): T {
	return JSON.parse(lzDecompress(data)) as T;
}
