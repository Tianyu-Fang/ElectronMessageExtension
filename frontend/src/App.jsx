import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

const App = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [contentType, setContentType] = useState("Text");
    const [recipientType, setRecipientType] = useState("Professor");

    const handleGenerate = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5001/generate", {
                message,
                contentType,
                recipientType
            });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error generating message.");
        }
    };

    return (
        <Container className="mt-5">
            <h1>📩 Electron Message Extension</h1>
            <Form>
                <Form.Group>
                    <Form.Label>Enter Your Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Format</Form.Label>
                    <Form.Select onChange={(e) => setContentType(e.target.value)}>
                        <option value="Text">Text</option>
                        <option value="Email">Email</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Recipient</Form.Label>
                    <Form.Select onChange={(e) => setRecipientType(e.target.value)}>
                        <option value="Professor">Professor</option>
                        <option value="Classmate">Classmate</option>
                    </Form.Select>
                </Form.Group>
                <Button className="mt-3" variant="primary" onClick={handleGenerate}>
                    ✨ Generate Message
                </Button>
            </Form>

            {response && (
                <div className="mt-4 p-3 border rounded bg-light">
                    <h5>Generated Response:</h5>
                    <p>{response}</p>
                </div>
            )}
        </Container>
    );
};

export default App;
