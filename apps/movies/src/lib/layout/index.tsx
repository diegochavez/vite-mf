import { Box, Flex, Text } from "@chakra-ui/react";
import { lazy, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Footer from "./Footer";
import Meta from "./Meta";
import { NavigationTemplate } from "./Navigation.template";

const Header = lazy(() => import("remote-header/Header"));

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ErrorBoundary fallback={<NavigationTemplate>Error</NavigationTemplate>}>
        <Suspense
          fallback={<NavigationTemplate>Loading...</NavigationTemplate>}
        >
          <Header />
        </Suspense>
      </ErrorBoundary>

      <Box margin="0 auto" maxWidth={800} transition="0.5s ease-out">
        <Meta />
        <Flex wrap="wrap" margin="8" minHeight="90vh">
          <Box width="full" as="main" marginY={22}>
            {children}
          </Box>
          <Footer />
        </Flex>
      </Box>
    </>
  );
};

export default Layout;
