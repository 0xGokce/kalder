import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      button: "#46568C",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#FFF",
        color: "#000",
      },
    },
  },
  fonts: {
    heading: "Karla, sans-serif",
    body: "Karla, sans-serif",
  },
  initialColorMode: "light",
  useSystemColorMode: false,
});

export default theme;
