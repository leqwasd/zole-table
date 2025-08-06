import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent,
} from "lz-string";
export function compress<T>(data: T): string {
	return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decompress<T>(data: string): T {
	return JSON.parse(decompressFromEncodedURIComponent(data)) as T;
}
