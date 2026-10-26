
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const backendUrl = process.env.CHAT_API_URL?.trim();

        if (!backendUrl) {
            return Response.json(
                { error: "آدرس سرویس چت تنظیم نشده است." },
                { status: 500 },
            );
        }

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await response.json();

        return Response.json(data, {
            status: response.status,
        });
    } catch {
        return Response.json(
            { error: "ارتباط با سرویس چت‌بات برقرار نشد." },
            { status: 502 },
        );
    }
}
