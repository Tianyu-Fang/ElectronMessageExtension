import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from "react-bootstrap";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Container className="mt-5 text-center">
      <h1>Electron Context Improver</h1>
      <p className="lead">Click the button to increment the counter:</p>
      
      <Button variant="primary" onClick={() => setCount(count + 1)}>
        Count is {count}
      </Button>

      <p className="mt-3">
        Edit <code>src/App.jsx</code> and save to test HMR.
      </p>
    </Container>
  );
};

export default App;
