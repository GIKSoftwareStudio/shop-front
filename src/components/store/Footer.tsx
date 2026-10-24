
import Link from "next/link";

export default function Footer() {
    return (
        <footer
            dir="rtl"
            className="mt-auto border-t bg-background"
        >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
                {/* برند */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="inline-block text-2xl font-bold"
                    >
                        شاپ
                        <span className="text-primary">فرانت</span>
                    </Link>

                    <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                        محصولاتی که دوست دارید پیدا کنید و از خریدی آسان و لذت‌بخش بهره‌مند شوید.
                    </p>
                </div>

                {/* دسترسی سریع */}
                <div>
                    <h3 className="mb-3 font-semibold">
                        دسترسی سریع
                    </h3>

                    <nav className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground"
                        >
                            صفحه اصلی
                        </Link>

                        <Link
                            href="/products"
                            className="transition-colors hover:text-foreground"
                        >
                            محصولات
                        </Link>
                    </nav>
                </div>

                {/* حساب کاربری */}
                <div>
                    <h3 className="mb-3 font-semibold">
                        حساب کاربری
                    </h3>

                    <nav className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="transition-colors hover:text-foreground"
                        >
                            ورود به حساب
                        </Link>

                        <Link
                            href="/profile"
                            className="transition-colors hover:text-foreground"
                        >
                            پروفایل من
                        </Link>
                    </nav>
                </div>

                {/* شبکه‌های اجتماعی */}
                <div>
                    <h3 className="mb-3 font-semibold">
                        ما را دنبال کنید
                    </h3>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="گیت‌هاب"
                            className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                        >
                            گیت‌هاب
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="اینستاگرام"
                            className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                        >
                            اینستاگرام
                        </a>
                    </div>
                </div>
            </div>

            {/* حق نشر */}
            <div className="border-t">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © ۱۴۰۵ شاپ‌فرانت؛ تمامی حقوق محفوظ است.
                    </p>

                    <p>
                        برای تجربه‌ای بهتر از خرید آنلاین
                    </p>
                </div>
            </div>
        </footer>
    );
}
