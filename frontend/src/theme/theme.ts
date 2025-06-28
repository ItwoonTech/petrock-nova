import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const breakpoints = {
  base: { value: '0em' }, // スマホ 0px
  sm: { value: '30em' }, // 480px
  md: { value: '48em' }, // タブレット 768px
  lg: { value: '62em' }, // PC 992px
  xl: { value: '80em' }, // 1280px
};

const sizes = {
  containerMaxWidth: { base: { value: '100%' }, md: { value: '500px' } },
  paddingVertical: { base: { value: '12' }, md: { value: '14' } },
  paddingBottom: { base: { value: '60px' }, md: { value: '80px' } },
};

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f2ff' },
          100: { value: '#e6f2ff' },
          200: { value: '#bfdeff' },
          300: { value: '#99caff' },
          950: { value: '#001a33' },
        },
        primary: {
          50: { value: '#e0f8ea' },
          100: { value: '#b3edc6' },
          200: { value: '#80e0a1' },
          300: { value: '#4dd37c' },
          400: { value: '#26c862' },
          500: { value: '#13C04F' },
          600: { value: '#10a746' },
          700: { value: '#0d8c3b' },
          800: { value: '#0b7130' },
          900: { value: '#064f20' },
        },
        secondary: {
          50: { value: '#e0f7ff' },
          100: { value: '#b3ecff' },
          200: { value: '#80e0ff' },
          300: { value: '#4dd4ff' },
          400: { value: '#26caff' },
          500: { value: '#34DBFF' },
          600: { value: '#00b5e6' },
          700: { value: '#0091b3' },
          800: { value: '#006d80' },
          900: { value: '#003a4d' },
        },
        accent: {
          100: { value: '#FFFACD' },
          200: { value: '#FFF176' },
          300: { value: '#F8F585' },
          400: { value: '#F7F140' },
          500: { value: '#F8F585' },
          600: { value: '#dcdc3e' },
          aaa: { value: '#F8F324'}
        },
        orange: {
          400: { value: '#FDC96E' },
          500: { value: '#F9A617' },
          600: { value: '#FF6A00' },
        },
        tree: {
          400: { value: '#D5BFA1' },
          500: { value: '#8A7263' },
        },
        sticky: {
          yellow: { value: '#FFE4B5' },
          red: { value: '#FFB6C1' },
          blue: { value: '#ADD8E6' },
        },
        text: { value: '#292929' },
        icon: { value: '#F8F585' },
        button: { value: '#757575' },
        thin: { value: '#DCDCDC' },
        yet: { value: '#9BEBB0' },
        done: { value: '#B7CDBD' },
        button_background: { value: '#888888' },
        hover: { value: '#FFFFFF66' },
        calender_text: { value: '#606060' },
        sun: { value: '#F6BC2E' },
      },
      breakpoints,
      sizes,
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '{colors.brand.100}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
        },
        // もし必要なら primary や secondary の semanticTokens もここに追加
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
