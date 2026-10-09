type product ={
    id:string;
    title:string;
    description:string;
    price:string;
    category:string;
    discountPercentage:string;
    brand:string;
}
export default function Productsdetails({product}:any){
    return (
        <div>
            <img
                src={product.thumbnail}
                alt={product.title}
                className="w-80 rounded-xl"
            />

            <h1 className="mt-6 text-3xl font-bold">
                {product.title}
            </h1>

            <p className="mt-4 text-xl">
                ${product.price}
            </p>

            <p className="mt-4">
                {product.description}
            </p>
        </div>
    )
}