function calculateCartTotal(products) {
  const total = products.reduce((acc, product) => {
    acc += product.product.price * product.quantity;
    return acc;
  }, 0);

  // To avoid multiply errors in JS, we first multiply total with 100 than divide 100 again
  const cartTotal = ((total * 100) / 100).toFixed(2);
  const stripeTotal = Number((total * 100).toFixed(2));

  return { cartTotal, stripeTotal };
}

export default calculateCartTotal;
