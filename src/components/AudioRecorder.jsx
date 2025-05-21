import React, { useState, useRef } from 'react';
import { Box, IconButton, useToast, VStack } from '@chakra-ui/react';
import { FaMicrophone, FaStop, FaPlay, FaDownload } from 'react-icons/fa';
import useFeedbackToast from './FeedbackToast';
import MicRecorder from 'mic-recorder-to-mp3';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const audioRef = useRef(null);
  const toast = useToast();
  const { showFeedbackRequest } = useFeedbackToast();

  const startRecording = () => {
    recorder.start()
      .then(() => {
        setIsRecording(true);
        toast({
          title: 'Gravação iniciada!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: 'Erro ao acessar o microfone',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const stopRecording = () => {
    recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        toast({
          title: 'Gravação finalizada!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        
        setTimeout(() => {
          showFeedbackRequest();
        }, 2000);
      })
      .catch((error) => {
        toast({
          title: 'Erro ao finalizar gravação',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <VStack spacing={4} align="center" p={6}>
      <IconButton
        icon={isRecording ? <FaStop /> : <FaMicrophone />}
        colorScheme={isRecording ? "red" : "blue"}
        size="lg"
        onClick={isRecording ? stopRecording : startRecording}
        aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
      />

      {audioUrl && (
        <VStack spacing={3}>
          <audio ref={audioRef} controls>
            <source src={audioUrl} type="audio/mp3" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
          <Box>
            <IconButton
              icon={<FaPlay />}
              colorScheme="green"
              size="md"
              onClick={playAudio}
              aria-label="Reproduzir áudio"
              mr={2}
            />
            <IconButton
              as="a"
              href={audioUrl}
              download="gravacao.mp3"
              icon={<FaDownload />}
              colorScheme="purple"
              size="md"
              aria-label="Baixar áudio"
            />
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default AudioRecorder;