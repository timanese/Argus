// src/theme.js or src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#f7fafc",
      // Define more shades here
    },
  },
  // Other theme customizations go here
});

export default theme;
