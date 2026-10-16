
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t bg-background">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
                {/* Brand */}
                <div className="space-y-3">
                    <Link href="/" className="inline-block text-2xl font-bold">
                        Shop<span className="text-primary">Front</span>
                    </Link>

                    <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                        Discover products you love and enjoy a simple shopping experience.
                    </p>
                </div>

                {/* Quick links */}
                <div>
                    <h3 className="mb-3 font-semibold">Quick Links</h3>

                    <nav className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">
                            Home
                        </Link>

                        <Link href="/products" className="hover:text-foreground">
                            Products
                        </Link>
                    </nav>
                </div>

                {/* Account */}
                <div>
                    <h3 className="mb-3 font-semibold">My Account</h3>

                    <nav className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                        <Link href="/login" className="hover:text-foreground">
                            Login
                        </Link>

                        <Link href="/profile" className="hover:text-foreground">
                            Profile
                        </Link>
                    </nav>
                </div>

                {/* Social links */}
                <div>
                    <h3 className="mb-3 font-semibold">Follow Us</h3>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <p>
                        © 2026 ShopFront. All rights reserved.
                    </p>

                    <p>Made for a better shopping experience.</p>
                </div>
            </div>
        </footer>
    );
}
