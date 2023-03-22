import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";

import Header from "lib/layout/Header";
import { theme } from "lib/styles/theme";

const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <Header />
    </ChakraProvider>
  </BrowserRouter>
);

export default App;
