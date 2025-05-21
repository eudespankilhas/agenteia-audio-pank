import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const FeedbackSurvey = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [feedback, setFeedback] = useState({
    experienceRating: '',
    easeOfUse: '',
    problems: 'não',
    audioPlayback: 'sim',
    suggestions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para enviar o feedback
    console.log('Feedback enviado:', feedback);
    toast({
      title: 'Feedback enviado!',
      description: 'Obrigado por nos ajudar a melhorar.',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    onClose();
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="purple"
        size="lg"
        aria-label="Dar feedback"
      >
        Avaliar Experiência
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pesquisa de Satisfação</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Como você avalia sua experiência com a gravação de áudio?</FormLabel>
                  <RadioGroup
                    value={feedback.experienceRating}
                    onChange={(value) => setFeedback({ ...feedback, experienceRating: value })}
                  >
                    <Stack spacing={2}>
                      <Radio value="excelente">Excelente</Radio>
                      <Radio value="boa">Boa</Radio>
                      <Radio value="regular">Regular</Radio>
                      <Radio value="ruim">Ruim</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>O que você achou do processo de gravação?</FormLabel>
                  <RadioGroup
                    value={feedback.easeOfUse}
                    onChange={(value) => setFeedback({ ...feedback, easeOfUse: value })}
                  >
                    <Stack spacing={2}>
                      <Radio value="muito_facil">Muito fácil</Radio>
                      <Radio value="facil">Fácil</Radio>
                      <Radio value="neutro">Neutro</Radio>
                      <Radio value="dificil">Difícil</Radio>
                      <Radio value="muito_dificil">Muito difícil</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Você encontrou algum problema durante a gravação?</FormLabel>
                  <RadioGroup
                    value={feedback.problems}
                    onChange={(value) => setFeedback({ ...feedback, problems: value })}
                  >
                    <Stack spacing={2}>
                      <Radio value="não">Não</Radio>
                      <Radio value="sim">Sim</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>A reprodução do áudio gravado funcionou como esperado?</FormLabel>
                  <RadioGroup
                    value={feedback.audioPlayback}
                    onChange={(value) => setFeedback({ ...feedback, audioPlayback: value })}
                  >
                    <Stack spacing={2}>
                      <Radio value="sim">Sim</Radio>
                      <Radio value="não">Não</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>O que você sugere para melhorar a experiência?</FormLabel>
                  <Textarea
                    value={feedback.suggestions}
                    onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
                    placeholder="Digite suas sugestões aqui..."
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  Enviar Feedback
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FeedbackSurvey;