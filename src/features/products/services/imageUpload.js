import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { contentTypeOf, putToPresignedUrl } from '@/api/s3Upload';

/**
 * Uploads local images straight to S3 via presigned URLs.
 * 1. POST /catalog/products/presigned-upload { content_types } -> [{ upload_url, s3_key }]
 * 2. PUT each file to its upload_url with the same Content-Type
 * Resolves to the s3 keys in the same order as `images` ({ uri, mimeType }).
 */
export async function uploadProductImages(images, onProgress) {
    if (images.length === 0) return [];
    const types = images.map(contentTypeOf);
    const { data } = await apiClient.post(endpoints.catalog.presignedUpload, { content_types: types });
    const uploads = data.uploads ?? [];
    if (uploads.length !== images.length) {
        throw Object.assign(new Error('Presign count mismatch'), { userMessage: "Couldn't prepare the image upload. Please try again." });
    }

    let done = 0;
    onProgress?.(done, images.length);
    await Promise.all(images.map(async (image, i) => {
        try {
            await putToPresignedUrl(image.uri, uploads[i].upload_url, types[i]);
        }
        catch (e) {
            throw Object.assign(e, { userMessage: `Image ${i + 1} failed to upload. Please try again.` });
        }
        done += 1;
        onProgress?.(done, images.length);
    }));
    return uploads.map((u) => u.s3_key);
}

/**
 * Best guess at the S3 key behind an existing image URL (path after the host).
 * Used when re-sending the image set on edit, since the API returns URLs but accepts keys.
 */
export function keyFromImageUrl(url) {
    const path = String(url).replace(/^https?:\/\/[^/]+\//, '').split('?')[0];
    try {
        return decodeURIComponent(path);
    }
    catch {
        return path;
    }
}
