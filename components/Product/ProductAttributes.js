import { Header, Button, Modal, ModalActions } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import { useRouter } from 'next/router';

function ProductAttributes({ description, _id, user }) {
  const [modal, setModal] = React.useState(false); // useState returns an array and here we destruct it
  const router = useRouter();

  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isRoot || isAdmin;

  async function handleDelete() {
    const url = `${baseUrl}/api/product`;
    const payload = { params: { _id } };
    await axios.delete(url, payload);
    router.push('/');
  }

  return (
    <>
      <Header as='h3'>About this product</Header>
      <p>{description}</p>
      {isRootOrAdmin && (
        <>
          <Button
            onClick={() => setModal(true)}
            icon='trash alternate outline'
            color='red'
            content='Delete Product'
          />
          {/* To make open false at the beginning, we'll use react useState hook */}
          <Modal open={modal} dimmer='blurring'>
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>Are you sure you want to delete this product?</Modal.Content>
            <ModalActions>
              <Button onClick={() => setModal(false)} content='Cancel'></Button>
              <Button onClick={handleDelete} negative icon='trash' content='Delete'></Button>
            </ModalActions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
