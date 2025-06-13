import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';

const Header: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg="black"
        color="white"
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4, md: 8 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'rgba(255, 255, 255, 0.1)'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            color="white"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <RouterLink to="/">
            <Text
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              fontWeight="900"
              textTransform="uppercase"
              letterSpacing="1px"
            >
              TAROT
            </Text>
          </RouterLink>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={8}>
              {NAV_ITEMS.map((navItem) => (
                <Link
                  key={navItem.label}
                  as={RouterLink}
                  to={navItem.href ?? '#'}
                  p={2}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={'white'}
                  textTransform="uppercase"
                  letterSpacing="1px"
                  position="relative"
                  _hover={{
                    textDecoration: 'none',
                    _after: {
                      width: '100%'
                    }
                  }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '1px',
                    bottom: '0',
                    left: '0',
                    bg: 'white',
                    transition: 'width 0.3s ease'
                  }}
                >
                  {navItem.label}
                </Link>
              ))}
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}
            color="white"
            textTransform="uppercase"
            letterSpacing="1px"
          >
            登录
          </Button>
          <Button
            as={'a'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'black'}
            bg={'white'}
            href={'#'}
            _hover={{
              bg: 'gray.200',
            }}
            borderRadius="0"
            textTransform="uppercase"
            letterSpacing="1px"
          >
            注册
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={'black'}
      p={4}
      display={{ md: 'none' }}
      borderBottom="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
    >
      {NAV_ITEMS.map((navItem) => (
        <Stack key={navItem.label} spacing={4} py={2}>
          <Link
            as={RouterLink}
            to={navItem.href ?? '#'}
            py={2}
            color="white"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing="1px"
          >
            {navItem.label}
          </Link>
        </Stack>
      ))}
    </Stack>
  );
};

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: '首页',
    href: '/',
  },
  {
    label: '单张解读',
    href: '/reading',
  },
  {
    label: '三张牌阵',
    href: '/tarot-reading',
  },
  {
    label: '抽牌解读',
    href: '/deck-drawing',
  },
  {
    label: '关于',
    href: '#',
  },
];

export default Header;