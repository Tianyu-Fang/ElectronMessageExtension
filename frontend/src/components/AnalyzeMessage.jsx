import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const AnalyzeMessage = () => {
    const [receivedMessage, setReceivedMessage] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');
    const [selectedTone, setSelectedTone] = useState('Neutral');
    const [finalResponse, setFinalResponse] = useState('');

    const handleAnalyze = async () => {
        if (receivedMessage.trim().length < 10) {
            setError('Please enter a longer message to analyze.');
            return;
        }
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/analyze', {
                message: receivedMessage
            });
            setAnalysis(res.data.analysis);
            setFinalResponse(res.data.analysis.responses['neutral']); // Default selection
        } catch (err) {
            setError(err.response?.data?.error || 'Error analyzing message.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(finalResponse)
            .then(() => alert('Response copied to clipboard!'))
            .catch(() => alert('Failed to copy.'));
    };

    const handleToneChange = (tone) => {
        setSelectedTone(tone);
        if (analysis.responses[tone.toLowerCase()]) {
            setFinalResponse(analysis.responses[tone.toLowerCase()]);
        }
    };

    return (
        <Container>
            <h2 className="my-4">🔍 Analyze Received Messages</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group className="mb-3" controlId="formReceivedMessage">
                    <Form.Label>📝 Received Message</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={4} 
                        value={receivedMessage} 
                        onChange={(e) => setReceivedMessage(e.target.value)} 
                        placeholder="Paste the message you received here..."
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleAnalyze}>
                    🔍 Analyze Message
                </Button>
            </Form>

            {analysis && (
                <>
                    <hr />
                    <h3 className="my-4">📊 Analysis Results</h3>
                    <Row>
                        <Col md={6}>
                            <h5>**Emotion Detection**</h5>
                            <p><strong>Primary Emotion:</strong> {analysis.emotion.charAt(0).toUpperCase() + analysis.emotion.slice(1)}</p>
                            
                            <h5>**Social Cues**</h5>
                            <ul>
                                {analysis.cues.map((cue, index) => (
                                    <li key={index}>{cue}</li>
                                ))}
                            </ul>
                            
                            <h5>**Key Words**</h5>
                            <p>{analysis.keywords.join(', ')}</p>
                        </Col>
                        <Col md={6}>
                            <h5>**Message Summary**</h5>
                            <pre style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
                                {analysis.summary}
                            </pre>
                            
                            <h5>**Response Suggestions**</h5>
                            <Form.Group>
                                <Form.Label>Select Tone:</Form.Label>
                                <Form.Select 
                                    value={selectedTone} 
                                    onChange={(e) => handleToneChange(e.target.value)}
                                >
                                    <option value="Positive">Positive</option>
                                    <option value="Neutral">Neutral</option>
                                    <option value="Negative">Negative</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>✏️ Your Response</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={4} 
                                    value={finalResponse} 
                                    onChange={(e) => setFinalResponse(e.target.value)} 
                                />
                            </Form.Group>
                            <Button variant="secondary" className="mt-2" onClick={handleCopy}>
                                📋 Copy Response
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default AnalyzeMessage;
