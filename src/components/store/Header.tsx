"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ShoppingCart,
    UserRound,
    Menu,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

export default function Header() {
    const [search, setSearch] = useState("");
    const router = useRouter();

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = search.trim();

        if (query) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
                {/* Logo */}
                <Link href="/" className="shrink-0 text-2xl font-bold">
                    Shop<span className="text-primary">Front</span>
                </Link>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="relative hidden flex-1 md:block"
                >
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search products..."
                        aria-label="Search products"
                        className="pr-10"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        aria-label="Search"
                    >
                        <Search className="size-4" />
                    </Button>
                </form>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/" className="text-sm hover:text-primary">
                        Home
                    </Link>

                    <Link
                        href="/products"
                        className="text-sm hover:text-primary"
                    >
                        Products
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {/* User menu with Avatar and Separator */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="User menu"
                                />
                            }
                        >
                            <Avatar className="size-8">
                                <AvatarImage
                                    src="/images/avatar.png"
                                    alt="User avatar"
                                />
                                <AvatarFallback>
                                    <UserRound className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                            <div className="flex items-center gap-3 p-3">
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src="/images/avatar.png"
                                        alt="User avatar"
                                    />
                                    <AvatarFallback>
                                        <UserRound className="size-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        My Account
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Welcome back!
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <DropdownMenuItem render={<Link href="/login" />}>
                                Login
                            </DropdownMenuItem>

                            <DropdownMenuItem render={<Link href="/profile" />}>
                                Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Shopping cart */}
                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Open shopping cart"
                                />
                            }
                        >
                            <ShoppingCart className="size-5" />
                        </SheetTrigger>

                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Shopping Cart</SheetTitle>
                            </SheetHeader>

                            <div className="p-4">
                                <p className="text-sm text-muted-foreground">
                                    Your cart is empty.
                                </p>

                                <Button
                                    render={<Link href="/products" />}
                                    className="mt-4 w-full"
                                >
                                    Browse products
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Open navigation menu"
                                    />
                                }
                            >
                                <Menu className="size-5" />
                            </SheetTrigger>

                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle>Navigation</SheetTitle>
                                </SheetHeader>

                                <nav className="flex flex-col gap-4 p-4">
                                    <Link href="/">Home</Link>
                                    <Link href="/products">Products</Link>
                                    <Link href="/login">Login</Link>
                                    <Link href="/profile">Profile</Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}