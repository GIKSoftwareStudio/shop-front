
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Package,
    Pencil,
} from "lucide-react";

import type { AdminProduct } from "@/api/admin/products";
import DeleteProductButton from "@/components/dashboard/products/DeleteProductButton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type ProductsTableProps = {
    products: AdminProduct[];
    currentPage: number;
    totalPages: number;
};

export default function ProductsTable({
                                          products,
                                          currentPage,
                                          totalPages,
                                      }: ProductsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
                <Table className="min-w-[900px] text-right">
                    <TableHeader>
                        <TableRow className="bg-muted/60 hover:bg-muted/60">
                            <TableHead className="text-right font-semibold">
                                تصویر
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                نام محصول
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                دسته‌بندی
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                قیمت
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                موجودی
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                عملیات
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product) => {
                            const image =
                                product.images?.find((item) =>
                                    Boolean(item.is_primary),
                                )?.image_url ??
                                product.images?.[0]?.image_url;

                            const detailsUrl = `/dashboard/products/${product.id}`;

                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Link
                                            href={detailsUrl}
                                            aria-label={`مشاهده جزئیات ${product.title}`}
                                            className="block w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                        >
                                            {image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={image}
                                                    alt={product.title}
                                                    loading="lazy"
                                                    className="size-12 rounded-lg border object-cover transition-opacity hover:opacity-80"
                                                />
                                            ) : (
                                                <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
                                                    <Package className="size-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </Link>
                                    </TableCell>

                                    <TableCell className="max-w-64">
                                        <Link
                                            href={detailsUrl}
                                            className="block truncate font-medium transition-colors hover:text-primary"
                                        >
                                            {product.title}
                                        </Link>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            شناسه:{" "}
                                            {product.id.toLocaleString("fa-IR")}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        {product.category?.name ??
                                            "بدون دسته‌بندی"}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap font-medium">
                                        {Number(product.price).toLocaleString(
                                            "fa-IR",
                                        )}{" "}
                                        تومان
                                    </TableCell>

                                    <TableCell>
                                        {typeof product.stock === "number" ? (
                                            product.stock.toLocaleString("fa-IR")
                                        ) : (
                                            <span className="text-muted-foreground">
                                                نامشخص
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/products/${product.id}/edit`}
                                                aria-label={`ویرایش ${product.title}`}
                                                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                                            >
                                                <Pencil className="size-4" />
                                                ویرایش
                                            </Link>

                                            <DeleteProductButton
                                                productId={product.id}
                                                productName={product.title}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {products.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-48 text-center"
                                >
                                    <Package className="mx-auto mb-3 size-10 text-muted-foreground" />
                                    <p className="font-medium">
                                        محصولی برای نمایش وجود ندارد.
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        می‌توانید اولین محصول را اضافه کنید.
                                    </p>
                                    <Link
                                        href="/dashboard/products/create"
                                        className="mt-4 inline-flex rounded-lg border px-4 py-2 hover:bg-muted"
                                    >
                                        افزودن محصول
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 border-t p-4">
                    {currentPage > 1 ? (
                        <Link
                            href={`/dashboard/products?page=${currentPage - 1}`}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                        >
                            <ChevronRight className="size-4" />
                            صفحه قبل
                        </Link>
                    ) : (
                        <span />
                    )}

                    <span className="text-sm text-muted-foreground">
                        {currentPage.toLocaleString("fa-IR")} /{" "}
                        {totalPages.toLocaleString("fa-IR")}
                    </span>

                    {currentPage < totalPages ? (
                        <Link
                            href={`/dashboard/products?page=${currentPage + 1}`}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                        >
                            صفحه بعد
                            <ChevronLeft className="size-4" />
                        </Link>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </div>
    );
}
