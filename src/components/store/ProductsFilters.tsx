
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    ChevronDown,
    SlidersHorizontal,
    RotateCcw,
    Check,
    Tag,
    Banknote,
} from "lucide-react";

type Props = {
    categories: {
        id: number;
        name: string;
    }[];
};

export default function ProductsFilters({ categories }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categoryId, setCategoryId] = useState(
        searchParams.get("category_id") ?? "",
    );

    const [minPrice, setMinPrice] = useState(
        searchParams.get("min_price") ?? "",
    );

    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("max_price") ?? "",
    );

    const [openSections, setOpenSections] = useState({
        categories: true,
        price: false,
    });

    useEffect(() => {
        setCategoryId(searchParams.get("category_id") ?? "");
        setMinPrice(searchParams.get("min_price") ?? "");
        setMaxPrice(searchParams.get("max_price") ?? "");
    }, [searchParams]);

    const activeFilters =
        Number(Boolean(categoryId)) +
        Number(Boolean(minPrice || maxPrice));

    function toggleSection(section: "categories" | "price") {
        setOpenSections((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    }

    function updateUrl(reset = false) {
        const params = new URLSearchParams(searchParams.toString());

        if (reset) {
            params.delete("category_id");
            params.delete("min_price");
            params.delete("max_price");
        } else {
            if (categoryId) {
                params.set("category_id", categoryId);
            } else {
                params.delete("category_id");
            }

            if (minPrice.trim()) {
                params.set("min_price", minPrice.trim());
            } else {
                params.delete("min_price");
            }

            if (maxPrice.trim()) {
                params.set("max_price", maxPrice.trim());
            } else {
                params.delete("max_price");
            }
        }

        // صفحه‌بندی بعد از تغییر فیلتر باید از صفحه اول شروع شود.
        params.delete("page");

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false },
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const min = minPrice.trim()
            ? Number(minPrice)
            : undefined;

        const max = maxPrice.trim()
            ? Number(maxPrice)
            : undefined;

        if (
            (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
            (max !== undefined && (!Number.isFinite(max) || max < 0))
        ) {
            return;
        }

        if (min !== undefined && max !== undefined && min > max) {
            return;
        }

        updateUrl();
    }

    function handleReset() {
        setCategoryId("");
        setMinPrice("");
        setMaxPrice("");

        updateUrl(true);
    }

    const selectedCategory = categories.find(
        (category) => String(category.id) === categoryId,
    );

    return (
        <section
            dir="rtl"
            className="w-full rounded-2xl border bg-card p-5 md:p-6"
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                        <SlidersHorizontal className="size-5" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold">
                            فیلتر محصولات
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                            محصولات موردنظرت رو پیدا کن
                        </p>
                    </div>
                </div>

                {activeFilters > 0 && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {activeFilters.toLocaleString("fa-IR")}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {/* Categories Mega Menu */}
                <div className="overflow-hidden rounded-xl border">
                    <button
                        type="button"
                        onClick={() => toggleSection("categories")}
                        aria-expanded={openSections.categories}
                        className="flex w-full items-center justify-between gap-3 p-4 text-right transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                <Tag className="size-4" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    دسته‌بندی محصولات
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {selectedCategory?.name ?? "همه دسته‌بندی‌ها"}
                                </p>
                            </div>
                        </div>

                        <ChevronDown
                            className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                openSections.categories
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                            openSections.categories
                                ? "grid-rows-[1fr]"
                                : "grid-rows-[0fr]"
                        }`}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div className="border-t p-3">
                                <div className="max-h-72 space-y-1 overflow-y-auto">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryId("")}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
                                            categoryId === ""
                                                ? "bg-primary/10 font-semibold text-primary"
                                                : "hover:bg-muted"
                                        }`}
                                    >
                                        <span>همه دسته‌بندی‌ها</span>

                                        {categoryId === "" && (
                                            <Check className="size-4" />
                                        )}
                                    </button>

                                    {categories.map((category) => {
                                        const isSelected =
                                            categoryId === String(category.id);

                                        return (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() =>
                                                    setCategoryId(
                                                        String(category.id),
                                                    )
                                                }
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
                                                    isSelected
                                                        ? "bg-primary/10 font-semibold text-primary"
                                                        : "hover:bg-muted"
                                                }`}
                                            >
                                                <span>{category.name}</span>

                                                {isSelected && (
                                                    <Check className="size-4" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Mega Menu */}
                <div className="overflow-hidden rounded-xl border">
                    <button
                        type="button"
                        onClick={() => toggleSection("price")}
                        aria-expanded={openSections.price}
                        className="flex w-full items-center justify-between gap-3 p-4 text-right transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                <Banknote className="size-4" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    محدوده قیمت
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {minPrice || maxPrice
                                        ? "محدوده قیمت انتخاب شده"
                                        : "انتخاب بازه قیمت به تومان"}
                                </p>
                            </div>
                        </div>

                        <ChevronDown
                            className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                openSections.price
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                            openSections.price
                                ? "grid-rows-[1fr]"
                                : "grid-rows-[0fr]"
                        }`}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div className="space-y-4 border-t p-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="min-price"
                                        className="text-xs font-medium text-muted-foreground"
                                    >
                                        حداقل قیمت (تومان)
                                    </label>

                                    <Input
                                        id="min-price"
                                        type="number"
                                        min="0"
                                        placeholder="مثلاً 100000"
                                        value={minPrice}
                                        onChange={(event) =>
                                            setMinPrice(event.target.value)
                                        }
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="max-price"
                                        className="text-xs font-medium text-muted-foreground"
                                    >
                                        حداکثر قیمت (تومان)
                                    </label>

                                    <Input
                                        id="max-price"
                                        type="number"
                                        min="0"
                                        placeholder="مثلاً 5000000"
                                        value={maxPrice}
                                        onChange={(event) =>
                                            setMaxPrice(event.target.value)
                                        }
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <Button
                    type="submit"
                    className="h-11 w-full gap-2"
                >
                    <SlidersHorizontal className="size-4" />
                    اعمال فیلترها
                </Button>

                {activeFilters > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="h-11 w-full gap-2"
                    >
                        <RotateCcw className="size-4" />
                        حذف همه فیلترها
                    </Button>
                )}
            </form>
        </section>
    );
}
