export default interface ApiDataError {
    error: boolean;
    message: string;
    status?: number;
    url?: string;
};