"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import  ProductsGrid  from "../../../components/led painting/ProductsGrid"
import  ProductsPage from "../../../components/led painting/ProductPage"
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductPSkelaton from "../../../components/loadings/ProductPSkelaton";





function Product({params}) {
  async function fetchProducts() {
      const res = await axios.get(`http://localhost:3000/api/products/${params.productId}`);
      return res.data;
  }

  const { data: products, isLoading, isError } = useQuery({
    queryKey:['product'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div><ProductPSkelaton /></div>;

  if (isError) return <div>Error fetching products</div>;
  
  const mproduct = products[0]

  console.log(typeof products)

  if(typeof products !== 'object'){
    return notFound()
  }

  return (
    
    <main>
        <section className="main-section">
          <ProductsPage mproduct={mproduct} />
        </section> 
        <section className="main-container2 p-12"> 
            <ProductsGrid />          
        </section>

    </main>
  )
}

export default Product