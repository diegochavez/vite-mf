import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export const NavigationTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
    <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
      <Text>{children}</Text>
    </Flex>
  </Box>
);
