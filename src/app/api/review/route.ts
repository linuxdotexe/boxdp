import { type NextRequest } from 'next/server';

import errorBuilder from '@/app/api/utils/errorBuilder';
import UrlValidationError from '@/app/api/utils/UrlValidationError';
import getReviewData from '@/app/api/utils/getReviewData';
import { AxiosError } from 'axios';

export const dynamic = 'force-dynamic'; // defaults to auto

const ipAddressRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

function validateUrl(url: string) {
    try {
        const url_obj = (new URL(url));   // throws TypeError if not a url

        if (ipAddressRegex.test((new URL(url)).hostname)) {
            throw new UrlValidationError(`pure number URLs are not accepted`);
        }

        if (url_obj.protocol !== 'https:') {
            throw new UrlValidationError(`protocol is invalid: ${url_obj.protocol}`);
        }

        url = (new URL(url)).href;  // proper https url

    } catch (err) {
        if (err instanceof UrlValidationError) {
            throw new UrlValidationError(
                err.message,
                422,
                url
            );
        }
        url = 'https://' + url;
        try {
            if (ipAddressRegex.test((new URL(url)).hostname)) {
                throw new UrlValidationError(`pure number URLs are not accepted`);
            }

            url = (new URL(url)).href;

        } catch (err) {
            if (err instanceof UrlValidationError) {
                throw new UrlValidationError(
                    err.message,
                    422,
                    url
                );
            }
        }
    }
    return url;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    let url = searchParams.get('url');
    if (!url) {
        return Response.json(errorBuilder(
            "Missing required query param: url",
            422,
        ));
    }
    // actual business
    try {
        url = validateUrl(url);
        const res = await getReviewData(url);
        return Response.json(res);
    } catch (err) {
        if (err instanceof UrlValidationError) {
            return Response.json(errorBuilder(
                err.message,
                err.status,
                err.url
            ));
        }
        if (err instanceof AxiosError) {
            return Response.json(errorBuilder(
                err.message,
                err.status,
                url
            ));
        }
        console.log(err);
        return Response.json(errorBuilder(
            (err instanceof Error ? err?.message : undefined) || `internal server error`,
            500,
        ));
    }
}