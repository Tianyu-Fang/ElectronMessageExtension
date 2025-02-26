// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import GenerateMessages from './components/GenerateMessages';
import AnalyzeMessage from './components/AnalyzeMessage';

const App = () => {
    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">📩 Communication Assistant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/generate">Generate Messages</Nav.Link>
                            <Nav.Link as={Link} to="/analyze">Analyze Messages</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
