import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  useToast,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
} from '@chakra-ui/react';
import RespostaAgente from '../RespostaAgente/RespostaAgente';
import { ollamaService } from '../../services/ollama';
import { FaMicrophone, FaStop, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import { FaMicrophoneSlash } from 'react-icons/fa';
import SuggestionButtons from './SuggestionButtons';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const toast = useToast();
  const [context, setContext] = useState([]);

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
    handleSendMessage();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setError(null);
      setIsProcessing(true);
      setProcessingProgress(0);
      
      const newMessage = { type: 'user', content: inputText };
      const updatedContext = [...context, newMessage];
      setMessages([...messages, newMessage]);
      setInputText('');

      // Atualizar contexto
      setContext(updatedContext);
      
      const botResponse = await ollamaService.sendMessage(inputText, messages);
      setProcessingProgress(100);
      
      const response = { type: 'bot', content: botResponse };
      setMessages(prev => [...prev, response]);
      
      // Atualizar contexto com a resposta
      setContext(prev => [...prev, response]);
    } catch (error) {
      setError({
        title: 'Erro ao enviar mensagem',
        description: error.message
      });
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setIsProcessing(true);
        
        const transcription = await ollamaService.sendMessage(audioBlob);
        
        setMessages(prev => [
          ...prev,
          { type: 'user', content: `🎤 ${transcription}` },
          { type: 'bot', content: response }
        ]);
        
        setIsProcessing(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Erro ao iniciar gravação',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch" h="80vh">
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle>{error.title}</AlertTitle>
            <AlertDescription>{error.description}</AlertDescription>
          </Alert>
        )}
        <Box
          flex={1}
          overflowY="auto"
          bg="rgba(255, 255, 255, 0.9)"
          p={4}
          borderRadius="lg"
          boxShadow="base"
        >
          {messages.map((message, index) => (
            message.type === 'user' ? (
              <Box
                key={index}
                bg="purple.100"
                p={3}
                borderRadius="lg"
                mb={2}
                alignSelf="flex-end"
                maxW="70%"
              >
                <Text>{message.content}</Text>
              </Box>
            ) : (
              <RespostaAgente
                key={index}
                texto={message.content}
                audioUrl={message.audioUrl || null}
              />
            )
          ))}
        </Box>

        <HStack spacing={2} align="center" justify="space-between" w="full" p={2} bg="rgba(255, 255, 255, 0.8)" borderRadius="lg">
          <Input
            flex={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem..."
            isDisabled={isProcessing}
            bg="white"
            borderRadius="md"
          />
          <IconButton
            icon={isRecording ? <FaStop /> : <FaMicrophone />} />
          <IconButton
            icon={<FaPaperPlane />}
            aria-label="Enviar mensagem"
            onClick={handleSendMessage}
            isDisabled={!inputText.trim() || isProcessing}
            colorScheme="blue"
            size="md"
          />
        </HStack>
        <SuggestionButtons onSuggestionClick={handleSuggestion} />
        <HStack spacing={2} align="center" justify="space-between" w="full" p={2} bg="rgba(255, 255, 255, 0.8)" borderRadius="lg">
          <IconButton
            icon={isRecording ? <FaStop /> : <FaMicrophone />}
            aria-label="Gravar áudio"
            onClick={isRecording ? stopRecording : startRecording}
            isDisabled={isProcessing}
            colorScheme="purple"
            size="md"
          />
          <IconButton
            icon={<FaPaperPlane />}
            aria-label="Enviar mensagem"
            onClick={handleSendMessage}
            isDisabled={!inputText.trim() || isProcessing}
            colorScheme="blue"
            size="md"
          />
          <IconButton
            icon={<FaWhatsapp />}
            aria-label="Compartilhar no WhatsApp"
            onClick={() => {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage) {
                const text = encodeURIComponent(lastMessage.content);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }
            }}
            colorScheme="green"
            isDisabled={messages.length === 0}
            size="md"
          />
            <IconButton
              icon={<FaPaperPlane />}
              aria-label="Enviar mensagem"
              onClick={handleSendMessage}
              isDisabled={!inputText.trim() || isProcessing}
              colorScheme="blue"
              size="md"
            />
            <IconButton
              icon={<FaWhatsapp />}
              aria-label="Compartilhar no WhatsApp"
              onClick={() => {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                  const text = encodeURIComponent(lastMessage.content);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }
              }}
              colorScheme="green"
              isDisabled={messages.length === 0}
              size="md"
            />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Chat;