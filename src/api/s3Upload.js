const DEFAULT_TYPE = 'image/jpeg';

/** Content-Type for a picked image ({ uri, mimeType? }). */
export const contentTypeOf = (image) => {
    if (image.mimeType?.startsWith('image/')) return image.mimeType;
    const ext = image.uri.split('?')[0].split('.').pop()?.toLowerCase();
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    return DEFAULT_TYPE;
};

/** PUTs a local file to a presigned S3 URL. Content-Type must match what was presigned. */
export async function putToPresignedUrl(uri, uploadUrl, contentType) {
    const file = await fetch(uri);
    const blob = await file.blob();
    const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: blob });
    if (!put.ok) {
        throw Object.assign(new Error(`S3 upload failed: ${put.status}`), { userMessage: 'The photo failed to upload. Please try again.' });
    }
}

/**
 * Single-image flow used by avatars and food items:
 * `requestUrl(contentType)` -> { upload_url, s3_key }, then PUT, then resolve the key.
 */
export async function uploadSingleImage(image, requestUrl) {
    const type = contentTypeOf(image);
    const { upload_url, s3_key } = await requestUrl(type);
    await putToPresignedUrl(image.uri, upload_url, type);
    return s3_key;
}
