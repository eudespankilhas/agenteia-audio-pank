// Classe simplificada para processamento de áudio
export class AudioProcessor {
  private mediaRecorder: MediaRecorder | null = null
  private stream: MediaStream | null = null
  private audioChunks: Blob[] = []
  private noiseReduction: boolean
  private autoEqualizer: boolean
  private silenceDetection: boolean

  constructor(
    options: {
      noiseReduction?: boolean
      autoEqualizer?: boolean
      silenceDetection?: boolean
    } = {},
  ) {
    this.noiseReduction = options.noiseReduction || false
    this.autoEqualizer = options.autoEqualizer || false
    this.silenceDetection = options.silenceDetection || false
  }

  async startRecording(): Promise<void> {
    try {
      // Configurações de áudio para melhor qualidade
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: this.noiseReduction,
          noiseSuppression: this.noiseReduction,
          autoGainControl: this.autoEqualizer,
        },
      }

      // Obter acesso ao microfone com as configurações aplicadas
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Configurar o MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      // Iniciar gravação
      this.mediaRecorder.start(100) // Coletar dados a cada 100ms
    } catch (error) {
      console.error("Erro ao iniciar gravação com processamento:", error)
      throw error
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob())
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })
        this.cleanup()
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
    }

    this.mediaRecorder = null
    this.stream = null
  }
}
