import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="w-screen">
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container fluid>
         <Link className="text-xl font-bold" to="/">TODO LIST</Link> 
         <Navbar.Toggle />
         <Navbar.Collapse>
          <Nav className="ms-auto">
            <Link className="nav-link" to='todos'>Todos</Link>
            <Link className="nav-link" to='register'>Register</Link>
            <Link className="nav-link" to='login'>Login</Link>
            <Button variant="outline-light">Logout</Button>
          </Nav>
         </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
