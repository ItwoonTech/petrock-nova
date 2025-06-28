import LoginFooter from '@/components/LoginFooter';
import LoginHeader from '@/components/LoginHeader';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const LoginScene = () => {
  return (
    <Box
      minH="100vh"
      bgGradient="linear-gradient(to bottom, var(--chakra-colors-secondary-500), var(--chakra-colors-secondary-50))"
      m={0}
      p={0}
      overflow="hidden"
      position="relative"
      display="flex"
      flexDirection="column"
    >
      <LoginHeader />
      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        <Outlet />
      </Box>
      <LoginFooter />
    </Box>
  );
};

export default LoginScene;
