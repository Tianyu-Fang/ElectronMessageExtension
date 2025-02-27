import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import GenerateMessages from './components/GenerateMessages';
import AnalyzeMessage from './components/AnalyzeMessage';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    return (
        <Router>
            {/* Styled Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
                <Container>
                    {/* Branding with an emoji icon */}
                    <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                        📩 Communication Assistant
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">  {/* Align items to the right */}
                            <Nav.Link as={Link} to="/generate" className="nav-link-custom">
                                ✏️ Generate Messages
                            </Nav.Link>
                            <Nav.Link as={Link} to="/analyze" className="nav-link-custom">
                                📊 Analyze Messages
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Page Content */}
            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<GenerateMessages />} />
                    <Route path="/generate" element={<GenerateMessages />} />
                    <Route path="/analyze" element={<AnalyzeMessage />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
