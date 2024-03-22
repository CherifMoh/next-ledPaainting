"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import  ProductsGrid  from "../../../components/ProductsGrid"
import  ProductsPage from "../../..//components/ProductPage"





function product({params}) {
  async function fetchProducts() {
      const res = await axios.get(`http://localhost:3000/api/products/${params.productId}`);
      return res.data;
  }

  const { data: products, isLoading, isError } = useQuery({
    queryKey:['product'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching products</div>;
  const mproduct = products[0]

  return (
    
    <main>
        <section className="main-section">
            <ProductsPage mproduct={mproduct} />
        </section> 
        <section className="main-container2"> 
          <ProductsGrid />
        </section>

    </main>
  )
}

export default product