import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { NavigationTemplate } from "./Navigation.template";

const Header = lazy(() => import("remote-header/Header"));

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("flyout") && searchParams.get("movieId")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchParams]);
  return (
    <>
      <ErrorBoundary
        fallback={<NavigationTemplate>Error...</NavigationTemplate>}
      >
        <Suspense
          fallback={<NavigationTemplate>Loading...</NavigationTemplate>}
        >
          <Header />
        </Suspense>
      </ErrorBoundary>
      <Box margin="0 auto" maxWidth={800} transition="0.5s ease-out">
        <Flex wrap="wrap" margin="8" minHeight="90vh">
          <Box width="full" as="main" marginY={22}>
            {children}
          </Box>
        </Flex>
      </Box>
      <Drawer
        size="md"
        isOpen={isOpen}
        onClose={() => null}
        variant="permanent"
      >
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Drawer Header</DrawerHeader>
          <DrawerBody>Drawer Body</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Layout;
