import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, HStack, Text, Image, Button, Badge, useColorModeValue } from '@chakra-ui/react';

// Produtos disponíveis
const produtos = require('../../data/produtos.json').produtos;

// Organizar produtos por tipo
const produtosPorTipo = {
  gratuito: produtos.filter(p => p.tipo === 'gratuito'),
  pago: produtos.filter(p => p.tipo === 'pago')
};

const produtos = [
  {
    id: 1,
    nome: "Ebook: Introdução à IA",
    descricao: "Guia prático sobre Inteligência Artificial para iniciantes.",
    tipo: "gratuito",
    preco: 0,
    imagem: "/assets/products/ebook-ia.png",
    link: "https://www.exemplo.com/ebook-ia.pdf"
  },
  {
    id: 2,
    nome: "Trilha de Áudio: Foco e Criatividade",
    descricao: "Áudio exclusivo para estimular foco e produtividade.",
    tipo: "gratuito",
    preco: 0,
    imagem: "/assets/products/audio-foco.png",
    link: "https://www.exemplo.com/audio-foco.mp3"
  },
  {
    id: 3,
    nome: "Ebook Premium: IA nos Negócios",
    descricao: "Aprenda a aplicar Inteligência Artificial no seu negócio com esse guia completo.",
    tipo: "pago",
    preco: 19.9,
    imagem: "/assets/products/ebook-premium.png",
    link: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SUA_ID_DE_PAGAMENTO"
  }
];

const LojaAgenteIA = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`;
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>Loja AGENTE IA - ÁUDIO PANK</Heading>
      
      {/* Produtos Gratuitos */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Produtos Gratuitos</Heading>
        <VStack spacing={4}>
          {produtosPorTipo.gratuito.map((product) => (
          <Box
            key={product.id}
            p={4}
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            borderRadius="md"
            cursor="pointer"
            _hover={{ boxShadow: 'md' }}
            onClick={() => handleProductClick(product)}
          >
            <Image
              src={product.imagem}
              alt={product.nome}
              width="100%"
              height="200px"
              objectFit="cover"
              borderRadius="md"
            />
            <VStack spacing={2} align="stretch" mt={2}>
              <HStack justify="space-between" align="center">
                <Heading size="md">{product.nome}</Heading>
                <Badge colorScheme="green">
                  Gratuito
                </Badge>
              </HStack>
              <Text color="gray.600" noOfLines={2}>{product.descricao}</Text>
              <HStack justify="space-between" align="center">
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => window.open(product.link, '_blank')}
                >
                  Baixar
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
        </VStack>
      </Box>

      {/* Produtos Pagos */}
      <Box>
        <Heading size="md" mb={4}>Produtos Pagos</Heading>
        <VStack spacing={4}>
          {produtosPorTipo.pago.map((product) => (
            <Box
              key={product.id}
              p={4}
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              borderRadius="md"
              cursor="pointer"
              _hover={{ boxShadow: 'md' }}
              onClick={() => handleProductClick(product)}
            >
              <Image
                src={product.imagem}
                alt={product.nome}
                width="100%"
                height="200px"
                objectFit="cover"
                borderRadius="md"
              />
              <VStack spacing={2} align="stretch" mt={2}>
                <HStack justify="space-between" align="center">
                  <Heading size="md">{product.nome}</Heading>
                  <Badge colorScheme="orange">
                    Premium
                  </Badge>
                </HStack>
                <Text color="gray.600" noOfLines={2}>{product.descricao}</Text>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="bold">R$ {product.preco.toFixed(2)}</Text>
                  <Button
                    size="sm"
                    colorScheme="orange"
                    onClick={() => window.open(product.link, '_blank')}
                  >
                    Comprar
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Detalhes do produto selecionado */}
      {showDetails && selectedProduct && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.8)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg={bgColor}
            p={6}
            borderRadius="md"
            w="80%"
            maxW="600px"
            boxShadow="xl"
          >
            <HStack justify="space-between" align="center" mb={4}>
              <Heading size="md">{selectedProduct.nome}</Heading>
              <Button
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Fechar
              </Button>
            </HStack>

            <Image
              src={selectedProduct.imagem}
              alt={selectedProduct.nome}
              width="100%"
              height="300px"
              objectFit="cover"
              borderRadius="md"
              mb={4}
            />

            <Text color={textColor} mb={4}>{selectedProduct.descricao}</Text>

            <HStack justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="xl">
                {selectedProduct.tipo === 'gratuito' ? 'Gratuito' : `R$ ${selectedProduct.preco.toFixed(2)}`}
              </Text>
              <Button
                size="lg"
                colorScheme={selectedProduct.tipo === 'gratuito' ? 'green' : 'orange'}
                onClick={() => window.open(selectedProduct.link, '_blank')}
              >
                {selectedProduct.tipo === 'gratuito' ? 'Baixar Agora' : 'Comprar Agora'}
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LojaAgenteIA;
