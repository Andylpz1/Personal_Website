import { extendTheme } from '@chakra-ui/react';

// 黑白主题颜色
const colors = {
  tarot: {
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      100: '#F7F7F7',
      200: '#E6E6E6',
      300: '#D1D1D1',
      400: '#ADADAD',
      500: '#888888',
      600: '#636363',
      700: '#4D4D4D',
      800: '#333333',
      900: '#1A1A1A',
    }
  },
};

// 自定义组件样式
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: '0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    variants: {
      solid: {
        bg: 'black',
        color: 'white',
        _hover: {
          bg: 'tarot.gray.800',
        },
      },
      outline: {
        border: '1px solid',
        borderColor: 'white',
        color: 'white',
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: '900',
      letterSpacing: '-1px',
    }
  }
};

// 全局样式
const styles = {
  global: {
    body: {
      bg: 'black',
      color: 'white',
    },
  },
};

// 字体
const fonts = {
  heading: '"Montserrat", sans-serif',
  body: '"Roboto", sans-serif',
};

// 创建主题
export const theme = extendTheme({
  colors,
  components,
  styles,
  fonts,
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
});