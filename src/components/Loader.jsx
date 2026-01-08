import { Container, Spinner } from "react-bootstrap";

export const Loader = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Spinner variant="dark"></Spinner>
      <span className="ms-1 mt-2">Carregando...</span>
    </Container>
  );
};
