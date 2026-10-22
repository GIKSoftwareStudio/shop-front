"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ShoppingCart,
    UserRound,
    Menu,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { type CartItem, useCartStore } from "@/api/store/cart-store";

function formatPrice(price: number) {
    return `${price.toLocaleString("fa-IR")} تومان`;
}

function CartContents({ hydrated }: { hydrated: boolean }) {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    if (!hydrated) {
        return (
            <div className="p-4 text-sm text-muted-foreground">
                در حال بارگذاری سبد خرید...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="p-4">
                <p className="text-sm text-muted-foreground">
                    سبد خرید شما خالی است.
                </p>

                <Button
                    nativeButton={false}
                    render={<Link href="/products" />}
                    className="mt-4 w-full"
                >
                    مشاهده محصولات
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {items.map((item: CartItem) => (
                    <div
                        key={item.id}
                        className="flex gap-3 rounded-2xl border p-3"
                    >
                        <Link
                            href={`/products/${item.id}`}
                            className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="size-full object-cover"
                            />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <Link
                                href={`/products/${item.id}`}
                                className="line-clamp-2 text-sm font-semibold"
                            >
                                {item.title}
                            </Link>

                            <p className="mt-1 text-sm font-bold text-primary">
                                {formatPrice(item.price)}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="size-7"
                                        aria-label={`افزایش تعداد ${item.title}`}
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1,
                                            )
                                        }
                                    >
                                        <Plus className="size-3" />
                                    </Button>

                                    <span className="min-w-5 text-center text-sm font-medium">
                                        {item.quantity.toLocaleString("fa-IR")}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="size-7"
                                        aria-label={`کاهش تعداد ${item.title}`}
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        }
                                    >
                                        <Minus className="size-3" />
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-destructive"
                                    aria-label={`حذف ${item.title}`}
                                    onClick={() => removeItem(item.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t bg-background p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                        مبلغ کل
                    </span>

                    <span className="font-extrabold">
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                <Button
                    nativeButton={false}
                    render={<Link href="/cart" />}
                    className="w-full"
                >
                    مشاهده سبد خرید
                </Button>
            </div>
        </div>
    );
}

function CartSheet({
                       hydrated,
                       mobile = false,
                   }: {
    hydrated: boolean;
    mobile?: boolean;
}) {
    const items = useCartStore((state) => state.items);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button
                        variant={mobile ? "outline" : "ghost"}
                        size="icon"
                        aria-label={`سبد خرید، ${totalItems} کالا`}
                        className={`relative ${
                            mobile
                                ? ""
                                : "size-9 rounded-full text-muted-foreground transition-colors hover:bg-white/80 hover:text-primary"
                        }`}
                    />
                }
            >
                <ShoppingCart
                    className={mobile ? "size-5" : "size-[17px]"}
                />

                {hydrated && totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {totalItems > 99
                            ? "۹۹+"
                            : totalItems.toLocaleString("fa-IR")}
                    </span>
                )}
            </SheetTrigger>

            <SheetContent
                side="right"
                dir="rtl"
                className="flex w-full flex-col sm:max-w-md"
            >
                <SheetHeader>
                    <SheetTitle>سبد خرید شما</SheetTitle>
                </SheetHeader>

                <CartContents hydrated={hydrated} />
            </SheetContent>
        </Sheet>
    );
}

export default function Header() {
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        Promise.resolve(useCartStore.persist.rehydrate()).then(
            () => {
                if (mounted) setHydrated(true);
            },
            () => {
                if (mounted) setHydrated(true);
            },
        );

        return () => {
            mounted = false;
        };
    }, []);

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = search.trim();

        if (!query) return;

        router.push(`/products?search=${encodeURIComponent(query)}`);
        setShowSearch(false);
    }

    function SearchForm({ mobile = false }: { mobile?: boolean }) {
        return (
            <form
                onSubmit={handleSearch}
                dir="rtl"
                className={
                    mobile
                        ? "flex w-full items-center gap-2"
                        : "absolute left-0 top-full z-50 mt-3 flex w-72 items-center gap-2 rounded-2xl border border-white/60 bg-background/95 p-3 shadow-xl backdrop-blur-xl"
                }
            >
                <Input
                    autoFocus
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="جستجوی محصولات..."
                    aria-label="جستجوی محصولات"
                    className="rounded-xl"
                />

                <Button
                    type="submit"
                    size="icon"
                    className="shrink-0 rounded-xl"
                    aria-label="جستجو"
                >
                    <Search className="size-4" />
                </Button>
            </form>
        );
    }

    return (
        <header className="sticky top-0 z-50 border-0 bg-background/70 backdrop-blur-xl">
            {/* Desktop Header */}
            <div
                dir="ltr"
                className="mx-auto hidden max-w-[1600px] items-center justify-between gap-6 px-8 py-5 md:flex lg:px-12"
            >
                {/* Left Capsule */}
                <div className="relative flex shrink-0 items-center gap-1 rounded-full border border-white/60 bg-white/55 px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
                    <Link
                        href="/"
                        dir="rtl"
                        aria-label="صفحه اصلی"
                        className="mr-2 whitespace-nowrap px-2 text-xl font-black tracking-tight text-foreground"
                    >
                        Shop<span className="text-primary">Front</span>
                    </Link>

                    <CartSheet hydrated={hydrated} />

                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="حساب کاربری"
                                    className="size-9 rounded-full text-muted-foreground transition-colors hover:bg-white/80 hover:text-primary"
                                />
                            }
                        >
                            <Avatar className="size-8">
                                <AvatarImage
                                    src="/images/avatar.png"
                                    alt="تصویر کاربر"
                                />
                                <AvatarFallback>
                                    <UserRound className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            dir="rtl"
                            className="w-48 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 p-3">
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src="/images/avatar.png"
                                        alt="تصویر کاربر"
                                    />
                                    <AvatarFallback>
                                        <UserRound className="size-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="text-sm font-medium">
                                        حساب کاربری
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        خوش آمدید
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <DropdownMenuItem render={<Link href="/login" />}>
                                ورود به حساب
                            </DropdownMenuItem>

                            <DropdownMenuItem render={<Link href="/profile" />}>
                                پروفایل من
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Desktop Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="جستجوی محصولات"
                        onClick={() => setShowSearch((value) => !value)}
                        className="size-9 rounded-full text-muted-foreground transition-colors hover:bg-white/80 hover:text-primary"
                    >
                        <Search className="size-[17px]" />
                    </Button>

                    {showSearch && <SearchForm />}
                </div>

                {/* Desktop Navigation */}
                <nav
                    dir="rtl"
                    aria-label="منوی اصلی"
                    className="flex min-w-0 items-center gap-1 rounded-full border border-white/60 bg-white/55 px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-2xl lg:gap-2 lg:px-5"
                >
                    <Link
                        href="/products"
                        className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/70 hover:text-primary lg:px-4 lg:text-sm"
                    >
                        محصولات
                    </Link>

                    <Link
                        href="/products"
                        className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/70 hover:text-primary lg:px-4 lg:text-sm"
                    >
                        دسته‌بندی‌ها
                    </Link>

                    <Link
                        href="/products"
                        className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/70 hover:text-primary lg:px-4 lg:text-sm"
                    >
                        فروشگاه
                    </Link>

                    <Link
                        href="/"
                        className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/70 hover:text-primary lg:px-4 lg:text-sm"
                    >
                        خانه
                    </Link>
                </nav>
            </div>

            {/* Mobile Header */}
            <div
                dir="ltr"
                className="flex items-center gap-3 px-4 py-4 md:hidden"
            >
                <Link
                    href="/"
                    dir="rtl"
                    className="shrink-0 text-2xl font-bold"
                >
                    Shop<span className="text-primary">Front</span>
                </Link>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="جستجوی محصولات"
                        onClick={() => setShowSearch((value) => !value)}
                    >
                        <Search className="size-5" />
                    </Button>

                    <CartSheet hydrated={hydrated} mobile />

                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="باز کردن منو"
                                />
                            }
                        >
                            <Menu className="size-5" />
                        </SheetTrigger>

                        <SheetContent side="right" dir="rtl">
                            <SheetHeader>
                                <SheetTitle>منوی سایت</SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col gap-4 p-4">
                                <Link href="/">خانه</Link>
                                <Link href="/products">محصولات</Link>
                                <Link href="/login">ورود</Link>
                                <Link href="/profile">پروفایل</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mobile Search */}
            {showSearch && (
                <div className="px-4 pb-4 md:hidden">
                    <SearchForm mobile />
                </div>
            )}
        </header>
    );
}