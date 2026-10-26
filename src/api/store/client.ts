
function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

    if (!baseUrl) {
        throw new Error(
            "NEXT_PUBLIC_API_BASE_URL is not configured. Check your .env.local file.",
        );
    }

    return baseUrl.replace(/\/+$/, "");
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
    body?: unknown;
};

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const { body, headers, ...requestOptions } = options;

    const isFormData =
        typeof FormData !== "undefined" && body instanceof FormData;

    const requestHeaders = new Headers(headers);

    requestHeaders.set("Accept", "application/json");

    if (body !== undefined && !isFormData) {
        requestHeaders.set("Content-Type", "application/json");
    } else if (isFormData) {
        // مرورگر باید خودش Content-Type و boundary رو تعیین کنه.
        requestHeaders.delete("Content-Type");
    }

    const response = await fetch(
        `${getApiBaseUrl()}/${endpoint.replace(/^\/+/, "")}`,
        {
            ...requestOptions,
            headers: requestHeaders,
            ...(body !== undefined
                ? {
                    body: isFormData
                        ? (body as FormData)
                        : JSON.stringify(body),
                }
                : {}),
        },
    );

    if (!response.ok) {
        let message = `درخواست API ناموفق بود: ${response.status} ${response.statusText}`;

        try {
            const errorData = await response.json();

            if (typeof errorData.message === "string") {
                message = errorData.message;
            } else if (errorData.errors) {
                message = Object.values(
                    errorData.errors as Record<string, string[]>,
                )
                    .flat()
                    .join(" ");
            }
        } catch {
            // اگر پاسخ خطا JSON نبود، پیام پیش‌فرض حفظ می‌شه.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
