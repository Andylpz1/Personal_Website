import React from 'react';
import { 
  Box,
  ChakraProvider
} from '@chakra-ui/react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import Home from './pages/Home';
import Reading from './pages/Reading';
import TarotReading from './pages/TarotReading';
import DeckDrawing from './pages/DeckDrawing';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/tarot-reading" element={<TarotReading />} />
            <Route path="/deck-drawing" element={<DeckDrawing />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;