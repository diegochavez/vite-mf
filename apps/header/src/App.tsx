import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "lib/layout/Header";
import { theme } from "lib/styles/theme";

const App = () => (
  <ChakraProvider theme={theme}>
    <Header />
  </ChakraProvider>
);

export default App;
