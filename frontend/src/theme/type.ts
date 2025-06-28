declare module "@chakra-ui/react" {
  interface ThemeTokens {
    colors: {
      brand: {
        50: { value: string };
        100: { value: string };
        200: { value: string };
        300: { value: string };
        950: { value: string };
      };
      primary: {
        50: { value: string };
        100: { value: string };
        200: { value: string };
        300: { value: string };
        400: { value: string };
        500: { value: string };
        600: { value: string };
        700: { value: string };
        800: { value: string };
        900: { value: string };
      };
      secondary: {
        50: { value: string };
        100: { value: string };
        200: { value: string };
        300: { value: string };
        400: { value: string };
        500: { value: string };
        600: { value: string };
        700: { value: string };
        800: { value: string };
        900: { value: string };
      };
      accent: {
        100: { value: string };
        200: { value: string };
        300: { value: string };
        400: { value: string };
        500: { value: string };
        600: { value: string };
      };
      text: { value: string };
      icon: { value: string };
      button: { value: string };
      thin: { value: string };
      tree: { value: string };
      background: { value: string };
      yet: { value: string };
    };
  }

  interface SemanticTokens {
    colors: {
      brand: {
        solid: { value: string };
        contrast: { value: string };
        fg: { value: string };
        muted: { value: string };
        subtle: { value: string };
        emphasized: { value: string };
        focusRing: { value: string };
      };
      // 他に semanticTokens 追加する場合はここに記述
    };
  }
}
