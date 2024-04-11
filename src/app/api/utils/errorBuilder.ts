import ApiDataError from "@/utils/ApiDataError";

export default function errorBuilder(
    message: string,
    status?: number,
    url?: string

): ApiDataError {
    return {
        error: true,
        message,
        status,
        url,
    }
}