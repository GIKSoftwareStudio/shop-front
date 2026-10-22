

import EditProductForm from "@/components/dashboard/products/EditProductForm";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({ params }: Props) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return (
            <section dir="rtl" className="rounded-xl border p-6">
                <h1 className="text-xl font-bold">شناسه محصول نامعتبر است.</h1>
            </section>
        );
    }

    return <EditProductForm id={productId} />;
}
