import { Navbar, Nav , Container } from "react-bootstrap";
import { DoorOpen } from "react-bootstrap-icons";



function MyNavbar() {

    function handleLogout (){
        // Récupération du token au login dans réact
        localStorage.removeItem('token')
    
    }

 return (
    <>

        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand>Gestion Stock</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/products">Products</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/signUp">SignUp</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={handleLogout} eventKey={2} href="/login">Logout <DoorOpen/> </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    </>
 );
 }

 export default MyNavbar;