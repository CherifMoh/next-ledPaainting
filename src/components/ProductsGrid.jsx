"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';



async function fetchProducts() {
    const res = await axios.get('http://localhost:3000/api/products');
    return res.data;
}

function ProductsGrid() {

    

    const { data: products, isLoading, isError } = useQuery({
        queryKey:['products'],
        queryFn: fetchProducts
    });

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error fetching products</div>;

    const productsElemnts = products.map(product => (
        <a key={product._id} className="product-card" href={`/led-painting/${product._id}`}>
            <div className="product-img-container">
                <img src={`${product.imageOn}`} className="product-img product-img-on" />
                <img src={`${product.imageOff}`} className="product-img product-img2 product-img-off" />
            </div>
            <div className="card-info">
                <span className="product-title">{product.title}</span>
                {/* <span className="product-price">from ${product.price}</span> */}
                <span className="sale-product-price">{product.price} DA</span>
            </div>
        </a>
    ))
    

    return (
        <div className="product-grid">
            {productsElemnts}
        </div>
    );
}

export default ProductsGrid;
