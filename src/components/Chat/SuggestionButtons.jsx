import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

const SuggestionButtons = ({ onSuggestionClick }) => {
  const suggestions = [
    { text: 'Vamos falar sobre futebol brasileiro?', icon: <FaWhatsapp /> },
    { text: 'Saber sobre IA', icon: <FaRobot /> },
    { text: 'Curiosidades da TV', icon: <FaRobot /> },
    { text: 'Me conte sobre as últimas notícias', icon: <FaRobot /> },
    { text: 'Qual é a previsão do tempo?', icon: <FaRobot /> },
    { text: 'Me ajude com uma tarefa', icon: <FaRobot /> },
    { text: 'Vamos conversar sobre música', icon: <FaRobot /> }
  ];

  return (
    <HStack spacing={2} mt={2}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          size="sm"
          variant="outline"
          leftIcon={suggestion.icon}
          onClick={() => onSuggestionClick(suggestion.text)}
        >
          {suggestion.text}
        </Button>
      ))}
    </HStack>
  );
};

export default SuggestionButtons;
