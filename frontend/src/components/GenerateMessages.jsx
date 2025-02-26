import { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { saveAs } from 'file-saver';

const GenerateMessages = () => {
    const [message, setMessage] = useState('');
    const [contentType, setContentType] = useState('Text');
    const [recipientType, setRecipientType] = useState('Professor');
    const [numResponses, setNumResponses] = useState(2);
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!message.trim()) {
            setError('Please enter a message.');
            return;
        }
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/generate', {
                message,
                contentType,
                recipientType,
                numResponses
            });
    
            // Ensure responses are properly structured
            const formattedResponses = res.data.responses.map((resp, index) => ({
                subject: contentType === "Email" ? `Variation ${index + 1}` : "",
                body: resp  // Store response directly as the body
            }));
    
            setResponses(formattedResponses);
        } catch (err) {
            setError(err.response?.data?.error || 'Error generating messages.');
        }
    };
    

    const handleCopy = (body) => {
        navigator.clipboard.writeText(body)
            .then(() => alert('Response copied to clipboard!'))
            .catch(() => alert('Failed to copy.'));
    };

    const handleDownload = () => {
        let content = responses.map((resp, index) => {
            return `Variation ${index + 1}:\n${resp.subject ? `Subject: ${resp.subject}\n` : ''}${resp.body}\n`;
        }).join('\n');
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "professional_responses.txt");
    };

    return (
        <Container>
            <h2 className="my-4">✨ Generate Polite Responses</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>✏️ Your Message</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Enter your message here..."
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formContentType">
                            <Form.Label>📝 Format</Form.Label>
                            <Form.Select 
                                value={contentType} 
                                onChange={(e) => setContentType(e.target.value)}
                            >
                                <option value="Text">Text</option>
                                <option value="Email">Email</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formRecipientType">
                            <Form.Label>👤 Recipient</Form.Label>
                            <Form.Select 
                                value={recipientType} 
                                onChange={(e) => setRecipientType(e.target.value)}
                            >
                                <option value="Professor">Professor</option>
                                <option value="Classmate">Classmate</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formNumResponses">
                            <Form.Label>🔢 Variations</Form.Label>
                            <Form.Range 
                                min={1} 
                                max={5} 
                                value={numResponses} 
                                onChange={(e) => setNumResponses(parseInt(e.target.value))}
                            />
                            <div>{numResponses}</div>
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" onClick={handleGenerate}>
                    ✨ Generate Messages
                </Button>
            </Form>

            {responses.length > 0 && (
    <>
        <hr />
        <h3 className="my-4">📄 {recipientType} Messages</h3>
        {responses.map((resp, index) => (
            <div key={index} className="mb-4">
                <h5>Variation {index + 1}</h5>
                {contentType === "Email" && resp.subject && (
                    <p><strong>Subject:</strong> {resp.subject}</p>
                )}
                {/* ✅ Fix formatting by using <pre> with white-space styling */}
                <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', whiteSpace: 'pre-wrap' }}>
                    {resp.body}
                </pre>
                <Button variant="secondary" onClick={() => handleCopy(resp.body)}>
                    📋 Copy Response
                </Button>
            </div>
        ))}
        <Button variant="success" onClick={handleDownload}>
            💾 Download All Versions
        </Button>
    </>
)}

        </Container>
    );
};

export default GenerateMessages;
