export default class UrlValidationError extends Error {
    status: number | undefined;
    url: string | undefined;
    constructor(message: string, status?: number, url?: string) {
        super(message);
        this.name = "UrlValidationError";
        this.status = status;
        this.url = url;
    }
}