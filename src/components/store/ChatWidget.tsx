
"use client";

import { useRef, useState, type FormEvent } from "react";
import { Bot, MessageCircle, Send, X, LoaderCircle } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const content = input.trim();

        if (!content || isLoading) return;

        const updatedMessages: Message[] = [
            ...messages,
            { role: "user", content },
        ];

        setMessages(updatedMessages);
        setInput("");
        setError("");
        setIsLoading(true);
        scrollToBottom();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "default",
                    messages: updatedMessages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : "دریافت پاسخ از چت‌بات ناموفق بود.",
                );
            }

            const reply = data.choices?.[0]?.message?.content;

            if (typeof reply !== "string" || !reply.trim()) {
                throw new Error("پاسخ معتبری از چت‌بات دریافت نشد.");
            }

            setMessages((current) => [
                ...current,
                { role: "assistant", content: reply },
            ]);

            scrollToBottom();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "ارتباط با چت‌بات برقرار نشد.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div dir="rtl" className="fixed bottom-5 left-5 z-[100]">
            {isOpen && (
                <section
                    aria-label="گفت‌وگو با دستیار فروشگاه"
                    className="mb-4 flex h-[min(520px,75vh)] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                >
                    <header className="flex items-center justify-between bg-gray-900 px-4 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white/10 p-2">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold">دستیار فروشگاه</h2>
                                <p className="text-xs text-gray-300">
                                    چطور می‌تونم کمکت کنم؟
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="بستن چت"
                            className="rounded-lg p-2 transition hover:bg-white/10"
                        >
                            <X size={21} />
                        </button>
                    </header>

                    <div
                        className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4"
                        aria-live="polite"
                    >
                        {messages.length === 0 && (
                            <div className="mt-8 text-center">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                                    <Bot size={28} className="text-gray-700" />
                                </div>
                                <p className="font-semibold text-gray-800">
                                    سلام! خوش اومدی 👋
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    هر سؤالی درباره محصولات یا خرید داری بپرس.
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={`${index}-${message.role}`}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-start"
                                        : "justify-end"
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 ${
                                        message.role === "user"
                                            ? "rounded-bl-sm bg-gray-900 text-white"
                                            : "rounded-br-sm border border-gray-200 bg-white text-gray-800"
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    در حال نوشتن پاسخ...
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
                            >
                                {error}
                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                    className="mr-2 underline"
                                >
                                    بستن
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
                    >
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="پیامت رو بنویس..."
                            aria-label="متن پیام"
                            disabled={isLoading}
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:bg-white disabled:opacity-60"
                        />

                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            aria-label="ارسال پیام"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={19} />
                        </button>
                    </form>
                </section>
            )}

            <div className="flex justify-start">
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-label={isOpen ? "بستن دستیار" : "باز کردن دستیار"}
                    aria-expanded={isOpen}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition hover:scale-105 hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900"
                >
                    {isOpen ? (
                        <X size={25} />
                    ) : (
                        <MessageCircle size={25} />
                    )}
                </button>
            </div>
        </div>
    );
}
