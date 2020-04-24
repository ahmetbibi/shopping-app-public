import React from 'react'; // To be able to use hooks we need to import react
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import baseUrl from '../utils/baseUrl';

function Home({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  // console.log(ctx.query);

  const page = ctx.query.page ? ctx.query.page : '1';
  const size = 9; //  Number of products per page

  // Fetch the data on the server
  const url = `${baseUrl}/api/products`; // In Next.JS, server and client are on the same port
  const payload = { params: { page, size } };
  const response = await axios.get(url, payload);

  // Returns response data as an object
  return response.data;
  // Note: This object will be merged with existing props
};

export default Home;
