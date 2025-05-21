class AudioMixer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  async loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  async mixAudio(voiceUrl, trackUrl, options = { voiceVolume: 0.8, trackVolume: 0.5, fadeDuration: 2000 }) {
    try {
      // Carregar os áudios
      const [voiceAudio, trackAudio] = await Promise.all([
        this.loadAudio(voiceUrl),
        this.loadAudio(trackUrl)
      ]);

      // Criar buffers de áudio
      const voiceSource = this.audioContext.createBufferSource();
      const trackSource = this.audioContext.createBufferSource();

      voiceSource.buffer = voiceAudio;
      trackSource.buffer = trackAudio;

      // Criar gain nodes para controlar o volume
      const voiceGain = this.audioContext.createGain();
      const trackGain = this.audioContext.createGain();

      voiceGain.gain.value = options.voiceVolume;
      trackGain.gain.value = options.trackVolume;

      // Conectar os nós
      voiceSource.connect(voiceGain);
      trackSource.connect(trackGain);

      // Criar gain node para o áudio final
      const finalGain = this.audioContext.createGain();
      voiceGain.connect(finalGain);
      trackGain.connect(finalGain);

      // Criar um nó de destino para capturar o áudio mixado
      const destination = this.audioContext.createMediaStreamDestination();
      finalGain.connect(destination);

      // Iniciar a reprodução
      voiceSource.start(0);
      trackSource.start(0);

      // Criar um nó de script para processar o áudio
      const processor = this.audioContext.createScriptProcessor(4096, 2, 2);
      processor.connect(this.audioContext.destination);

      // Criar um blob do áudio mixado
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl;
      };

      mediaRecorder.start();

      // Aguardar o término da reprodução
      await new Promise(resolve => {
        const duration = Math.max(
          voiceAudio.duration,
          trackAudio.duration
        ) * 1000;
        setTimeout(resolve, duration);
      });

      mediaRecorder.stop();

      return mediaRecorder.onstop;
    } catch (error) {
      console.error('Erro ao mixar áudio:', error);
      throw error;
    }
  }
}

export const mixAudio = async (voiceUrl, trackUrl) => {
  const mixer = new AudioMixer();
  return await mixer.mixAudio(voiceUrl, trackUrl);
};
