import axios from 'axios';
import ProductSummary from '../components/Product/ProductSummary';
import ProductAttributes from '../components/Product/ProductAttributes';
import baseUrl from '../utils/baseUrl';

// First get the initial props then use it in the component

function Product({ product, user }) {
  // console.log({ product });
  return (
    <>
      <ProductSummary user={user} {...product} />
      <ProductAttributes user={user} {...product} />
    </>
  );
}

// query comes from ctx variable and we destruct it
Product.getInitialProps = async ({ query: { _id } }) => {
  // This is normal way
  // const url = `${baseUrl}/api/product?_id=${_id}`;

  // This is an alternate way
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } };
  const response = await axios.get(url, payload);

  return { product: response.data };
};

export default Product;
