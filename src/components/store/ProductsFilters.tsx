
"use client";

import { useState, type ReactNode } from "react";
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
    PackageCheck,
    ArrowDownWideNarrow,
} from "lucide-react";

type Props = {
    categories: {
        id: number;
        name: string;
    }[];
};

type FilterSection =
    | "categories"
    | "price"
    | "stock"
    | "sorting";

type SectionHeaderProps = {
    section: FilterSection;
    icon: ReactNode;
    title: string;
    description: string;
    isOpen: boolean;
    onToggle: () => void;
};

function SectionHeader({
                           icon,
                           title,
                           description,
                           isOpen,
                           onToggle,
                       }: SectionHeaderProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-3 p-4 text-right transition-colors hover:bg-muted/50"
        >
            <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold">{title}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <ChevronDown
                className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                }`}
            />
        </button>
    );
}

function SectionContent({
                            isOpen,
                            children,
                        }: {
    isOpen: boolean;
    children: ReactNode;
}) {
    return (
        <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
        >
            <div className="min-h-0 overflow-hidden">
                <div className="border-t p-4">{children}</div>
            </div>
        </div>
    );
}

function ChoiceButton({
                          selected,
                          onClick,
                          children,
                      }: {
    selected: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
                selected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "hover:bg-muted"
            }`}
        >
            <span>{children}</span>

            {selected && <Check className="size-4 shrink-0" />}
        </button>
    );
}

export default function ProductsFilters({ categories }: Props) {
    const searchParams = useSearchParams();

    // با تغییر URL، کامپوننت داخلی دوباره با مقادیر جدید ساخته می‌شود.
    const queryKey = searchParams.toString();

    return (
        <ProductsFiltersContent
            key={queryKey}
            categories={categories}
            queryString={queryKey}
        />
    );
}

function ProductsFiltersContent({
                                    categories,
                                    queryString,
                                }: Props & { queryString: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const initialParams = new URLSearchParams(queryString);

    const [categoryId, setCategoryId] = useState(
        initialParams.get("category_id") ?? "",
    );

    const [minPrice, setMinPrice] = useState(
        initialParams.get("min_price") ?? "",
    );

    const [maxPrice, setMaxPrice] = useState(
        initialParams.get("max_price") ?? "",
    );

    const [inStock, setInStock] = useState(
        initialParams.get("in_stock") ?? "",
    );

    const [sortBy, setSortBy] = useState(
        initialParams.get("sort_by") ?? "",
    );

    const [openSections, setOpenSections] = useState<
        Record<FilterSection, boolean>
    >({
        categories: true,
        price: false,
        stock: false,
        sorting: false,
    });

    const activeFilters =
        Number(Boolean(categoryId)) +
        Number(Boolean(minPrice)) +
        Number(Boolean(maxPrice)) +
        Number(Boolean(inStock)) +
        Number(Boolean(sortBy));

    const selectedCategory = categories.find(
        (category) => String(category.id) === categoryId,
    );

    const stockLabel =
        inStock === "true"
            ? "فقط محصولات موجود"
            : inStock === "false"
                ? "فقط محصولات ناموجود"
                : "همه محصولات";

    const sortingLabel =
        sortBy === "newest"
            ? "جدیدترین محصولات"
            : sortBy === "oldest"
                ? "قدیمی‌ترین محصولات"
                : "پیش‌فرض";

    function toggleSection(section: FilterSection) {
        setOpenSections((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    }

    function updateUrl(reset = false) {
        const params = new URLSearchParams(queryString);

        if (reset) {
            params.delete("category_id");
            params.delete("min_price");
            params.delete("max_price");
            params.delete("in_stock");
            params.delete("sort_by");
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

            if (inStock === "true" || inStock === "false") {
                params.set("in_stock", inStock);
            } else {
                params.delete("in_stock");
            }

            if (sortBy === "newest" || sortBy === "oldest") {
                params.set("sort_by", sortBy);
            } else {
                params.delete("sort_by");
            }
        }

        // بعد از تغییر فیلتر، به صفحه اول برگرد.
        params.delete("page");

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false },
        );
    }

    function handleSubmit() {
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
        setInStock("");
        setSortBy("");

        updateUrl(true);
    }

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

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                }}
                className="space-y-4"
            >
                {/* Categories */}
                <div className="overflow-hidden rounded-xl border">
                    <SectionHeader
                        section="categories"
                        icon={<Tag className="size-4" />}
                        title="دسته‌بندی محصولات"
                        description={
                            selectedCategory?.name ?? "همه دسته‌بندی‌ها"
                        }
                        isOpen={openSections.categories}
                        onToggle={() => toggleSection("categories")}
                    />

                    <SectionContent isOpen={openSections.categories}>
                        <div className="max-h-72 space-y-1 overflow-y-auto">
                            <ChoiceButton
                                selected={categoryId === ""}
                                onClick={() => setCategoryId("")}
                            >
                                همه دسته‌بندی‌ها
                            </ChoiceButton>

                            {categories.map((category) => (
                                <ChoiceButton
                                    key={category.id}
                                    selected={
                                        categoryId === String(category.id)
                                    }
                                    onClick={() =>
                                        setCategoryId(String(category.id))
                                    }
                                >
                                    {category.name}
                                </ChoiceButton>
                            ))}
                        </div>
                    </SectionContent>
                </div>

                {/* Price */}
                <div className="overflow-hidden rounded-xl border">
                    <SectionHeader
                        section="price"
                        icon={<Banknote className="size-4" />}
                        title="محدوده قیمت"
                        description={
                            minPrice || maxPrice
                                ? "محدوده قیمت انتخاب شده"
                                : "انتخاب بازه قیمت به تومان"
                        }
                        isOpen={openSections.price}
                        onToggle={() => toggleSection("price")}
                    />

                    <SectionContent isOpen={openSections.price}>
                        <div className="space-y-4">
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
                    </SectionContent>
                </div>

                {/* Stock */}
                <div className="overflow-hidden rounded-xl border">
                    <SectionHeader
                        section="stock"
                        icon={<PackageCheck className="size-4" />}
                        title="وضعیت موجودی"
                        description={stockLabel}
                        isOpen={openSections.stock}
                        onToggle={() => toggleSection("stock")}
                    />

                    <SectionContent isOpen={openSections.stock}>
                        <div className="space-y-1">
                            <ChoiceButton
                                selected={inStock === ""}
                                onClick={() => setInStock("")}
                            >
                                همه محصولات
                            </ChoiceButton>

                            <ChoiceButton
                                selected={inStock === "true"}
                                onClick={() => setInStock("true")}
                            >
                                فقط محصولات موجود
                            </ChoiceButton>

                            <ChoiceButton
                                selected={inStock === "false"}
                                onClick={() => setInStock("false")}
                            >
                                فقط محصولات ناموجود
                            </ChoiceButton>
                        </div>
                    </SectionContent>
                </div>

                {/* Sorting */}
                <div className="overflow-hidden rounded-xl border">
                    <SectionHeader
                        section="sorting"
                        icon={<ArrowDownWideNarrow className="size-4" />}
                        title="مرتب‌سازی"
                        description={sortingLabel}
                        isOpen={openSections.sorting}
                        onToggle={() => toggleSection("sorting")}
                    />

                    <SectionContent isOpen={openSections.sorting}>
                        <div className="space-y-1">
                            <ChoiceButton
                                selected={sortBy === ""}
                                onClick={() => setSortBy("")}
                            >
                                پیش‌فرض
                            </ChoiceButton>

                            <ChoiceButton
                                selected={sortBy === "newest"}
                                onClick={() => setSortBy("newest")}
                            >
                                جدیدترین به قدیمی‌ترین
                            </ChoiceButton>

                            <ChoiceButton
                                selected={sortBy === "oldest"}
                                onClick={() => setSortBy("oldest")}
                            >
                                قدیمی‌ترین به جدیدترین
                            </ChoiceButton>
                        </div>
                    </SectionContent>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
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
                </div>
            </form>
        </section>
    );
}
