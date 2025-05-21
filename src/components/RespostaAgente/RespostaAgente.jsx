import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function RespostaAgente({ texto, audioUrl }) {
  const toast = useToast();

  const handleCopy = () => {
    toast({
      title: 'Texto copiado!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      bg="gray.700"
      color="white"
      p={4}
      borderRadius="xl"
      boxShadow="md"
      w="full"
      maxW="700px"
      mt={3}
    >
      <HStack justify="space-between" align="center">
        <Text fontSize="md" whiteSpace="pre-wrap" flex={1}>
          {texto}
        </Text>

        <HStack spacing={2} ml={4}>
          <CopyToClipboard text={texto} onCopy={handleCopy}>
            <IconButton
              icon={<CopyIcon />}
              aria-label="Copiar texto"
              size="sm"
              variant="solid"
              colorScheme="teal"
              borderRadius="md"
            />
          </CopyToClipboard>
          {audioUrl && (
            <a href={audioUrl} download="resposta_audio.mp3">
              <IconButton
                icon={<DownloadIcon />}
                aria-label="Download do áudio"
                size="sm"
                variant="solid"
                colorScheme="blue"
                borderRadius="md"
              />
            </a>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}