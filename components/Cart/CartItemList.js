import { Segment, Header, Button, Icon, Item, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItemList({ products, user, handleRemoveFromCart, success }) {
  const router = useRouter();

  function mapCartProductsToItems(products) {
    return products.map((product) => ({
      childKey: product.product._id,
      header: (
        <Item.Header as='a' onClick={() => router.push(`/product?_id=${product.product._id}`)}>
          {product.product.name}
        </Item.Header>
      ),
      image: product.product.mediaUrl,
      meta: `${product.quantity} x $${product.product.price}`,
      fluid: 'true',
      extra: (
        <Button
          basic
          icon='remove'
          floated='right'
          onClick={() => handleRemoveFromCart(product.product._id)}
        />
      ),
    }));
  }

  if (success) {
    return (
      <Message
        success
        header='Success!'
        content='Your order and payment has been accepted'
        icon='star outline'
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment secondary color='teal' inverted textAlign='center' placeholder>
        <Header icon>
          <Icon name='shopping basket' />
          No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color='orange' onClick={() => router.push('/')}>
              View Products
            </Button>
          ) : (
            <Button color='blue' onClick={() => router.push('/login')}>
              Login to add products
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
