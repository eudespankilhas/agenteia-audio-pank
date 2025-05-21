import { useToast } from '@chakra-ui/react';

const useFeedbackToast = () => {
  const toast = useToast();

  const showFeedbackRequest = () => {
    toast({
      title: 'Gostou da gravação de áudio?',
      description: 'Clique no botão "Avaliar Experiência" para nos dar sua opinião!',
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    });
  };

  return { showFeedbackRequest };
};

export default useFeedbackToast;