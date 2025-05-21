import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import {
  Box, Text, Button, VStack, Spinner, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb
} from '@chakra-ui/react';

const RespostaComVozAvancado = () => {
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vozes, setVozes] = useState([]);
  const [vozSelecionada, setVozSelecionada] = useState(null);
  const [velocidade, setVelocidade] = useState(1);

  useEffect(() => {
    const buscarRespostas = async () => {
      const { data, error } = await supabase
        .from('audios_com_agente')
        .select('*');

      if (error) {
        console.error('Erro ao buscar respostas:', error);
      } else {
        setRespostas(data);
      }
      setLoading(false);
    };

    buscarRespostas();
  }, []);

  useEffect(() => {
    const carregarVozes = () => {
      const todasVozes = window.speechSynthesis.getVoices();
      const vozesPtBr = todasVozes.filter(voz => voz.lang.includes('pt-BR'));
      setVozes(vozesPtBr);
      if (vozesPtBr.length > 0) {
        setVozSelecionada(vozesPtBr[0].name);
      }
    };

    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = carregarVozes;
      carregarVozes();
    }
  }, []);

  const falarTexto = (texto) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    const voz = vozes.find(v => v.name === vozSelecionada);
    if (voz) utterance.voice = voz;
    utterance.lang = 'pt-BR';
    utterance.rate = velocidade;
    synth.cancel(); // interrompe qualquer fala anterior
    synth.speak(utterance);
  };

  if (loading) return <Spinner />;

  return (
    <VStack spacing={5} p={6} align="stretch">
      <Box borderWidth="1px" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>🔊 Configurações de Voz</Text>

        <Text fontSize="sm" mb={1}>Selecionar voz:</Text>
        <Select
          value={vozSelecionada}
          onChange={(e) => setVozSelecionada(e.target.value)}
        >
          {vozes.map((voz, idx) => (
            <option key={idx} value={voz.name}>{voz.name}</option>
          ))}
        </Select>

        <Text fontSize="sm" mt={4} mb={1}>Velocidade da fala: {velocidade.toFixed(1)}x</Text>
        <Slider
          defaultValue={1}
          min={0.5}
          max={2}
          step={0.1}
          value={velocidade}
          onChange={(val) => setVelocidade(val)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      {respostas.map((resposta) => (
        <Box key={resposta.audio_id} p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold">{resposta.agente_nome}</Text>
          <Text mb={2}>{resposta.titulo}</Text>
          <Text color="gray.600" mb={3}>{resposta.descricao}</Text>
          <Button colorScheme="blue" onClick={() => falarTexto(resposta.descricao)}>
            ▶ Ouvir Resposta com Voz
          </Button>
        </Box>
      ))}
    </VStack>
  );
};

export default RespostaComVozAvancado;