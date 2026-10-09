"use client"
import {router} from "next/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type product = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    tags: string[];
};

export default function ProductCard({ product }: any) {
    const router = useRouter();
    return (
        <Link href={`/products/${product.id}`}
            className="flex flex-row items-center justify-center">
            <div className="flex cursor-pointer flex-col h-auto w-max bg-white rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={"bg-[#d9d9d9] rounded-lg m-2"}
                    src={product.thumbnail}
                    alt={product.title}
                />
                <div className={"m-2"}>
                    <p className="text-green-500">{product.tags}</p>

                    <h2 className={"text-black font-bold"}>{product.title}</h2>

                    <p className={"text-black font-mono"}>${product.price}</p>
                </div>
                <button className={"bg-black m-2 rounded-full"}
                onClick={() => {}}>
                    <div className="text-white">
                        Buy Now
                    </div>
                </button>
            </div>
        </Link>
    );
}