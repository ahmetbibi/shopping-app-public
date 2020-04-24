import React from 'react';
import { Header, Form, Input, TextArea, Button, Image, Message, Icon } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';

function CreateProduct() {
  const INITIAL_PRODUCT = {
    name: '',
    price: '',
    media: '',
    description: '',
  };

  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  // To hidden button in case of empty fields
  React.useEffect(() => {
    const isProduct = Object.values(product).every((elm) => Boolean(elm));
    isProduct ? setDisabled(false) : setDisabled(true);

    // return () => {
    //   cleanup;
    // };
  }, [product]);

  function handleChange(event) {
    // Destruct the name and value fields from related form fields
    // For files, we are using files property from target object
    const { name, value, files } = event.target;
    if (name === 'media') {
      setProduct((preState) => ({ ...preState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      // To update every related field we use [] called computed property
      // To get the previous state, in setter function we are using
      // Updater function (or updater pattern) and this provides the previous state
      // This pattern comes from React hooks
      setProduct((preState) => ({ ...preState, [name]: value }));
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append('file', product.media);
    data.append('upload_preset', 'reactreserve');
    data.append('cloud_name', 'dweqvvczi');
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');

      const mediaUrl = await handleImageUpload();

      // console.log({ mediaUrl });

      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };

      /** We can also do it without destructing the product
       * const payload = { ...product, mediaUrl };
       */

      const response = await axios.post(url, payload);
      // console.log({ response });

      // setLoading(false);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      // console.error('ERROR!!!', error);
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as='h2' block>
        <Icon name='add' color='orange' />
        Create New Product
      </Header>
      <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
        <Message error header='Oops!' content={error} />
        <Message success icon='check' header='Success!' content='Your product has been posted!' />
        <Form.Group widths='equal'>
          <Form.Field
            control={Input}
            name='name'
            label='Name'
            placeholder='Name'
            onChange={handleChange}
            value={product.name}
          />
          <Form.Field
            control={Input}
            name='price'
            label='Price'
            placeholder='Price'
            min='0.00'
            step='0.01'
            type='number'
            onChange={handleChange}
            value={product.price}
          />
          <Form.Field
            control={Input}
            name='media'
            accept='image/*'
            label='Media'
            content='Select Image'
            type='file'
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size='small' />
        <Form.Field
          control={TextArea}
          name='description'
          label='Description'
          placeholder='Description'
          onChange={handleChange}
          value={product.description}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color='blue'
          icon='pencil alternate'
          type='submit'
          content='Submit'
        />
      </Form>
    </>
  );
}

export default CreateProduct;
