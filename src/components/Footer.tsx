import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
} from '@chakra-ui/react';
import { FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2} textTransform="uppercase" letterSpacing="1px">
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={'black'}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      border="1px solid white"
      _hover={{
        bg: 'white',
        color: 'black',
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const Footer: React.FC = () => {
  return (
    <Box
      bg={'black'}
      color={'white'}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={'rgba(255, 255, 255, 0.1)'}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Text
                fontFamily={'heading'}
                fontWeight="900"
                fontSize="2xl"
                textTransform="uppercase"
                letterSpacing="1px"
              >
                TAROT
              </Text>
            </Box>
            <Text fontSize={'sm'} opacity={0.7}>
              © 2025 神秘塔罗. 保留所有权利
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
              <SocialButton label={'GitHub'} href={'#'}>
                <FaGithub />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>公司</ListHeader>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>关于我们</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>博客</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>联系我们</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>支持</ListHeader>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>帮助中心</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>服务条款</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>隐私政策</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>服务</ListHeader>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>在线占卜</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>塔罗课程</Link>
            <Link href={'#'} _hover={{ textDecoration: 'none', opacity: 0.7 }}>个人解读</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer;