"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mic,
  Play,
  Square,
  Save,
  AudioWaveformIcon as Waveform,
  Headphones,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import getSupabaseClient, { isSupabaseConfigured } from "@/lib/supabase-client"

// Limite de tamanho para o plano gratuito do Vercel (4MB é seguro)
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioFiles, setAudioFiles] = useState<any[]>([])
  const [volume, setVolume] = useState([75])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [audioSize, setAudioSize] = useState(0)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [showSupabaseAlert, setShowSupabaseAlert] = useState(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar se o Supabase está configurado
  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured())

    // Configurar timer para esconder o alerta após 10 segundos
    if (!isSupabaseConfigured()) {
      const timer = setTimeout(() => {
        setShowSupabaseAlert(false)
      }, 10000) // 10 segundos

      return () => clearTimeout(timer)
    }
  }, [])

  // Fetch audio files from Supabase on component mount
  useEffect(() => {
    // Apenas busca áudios no cliente e se o Supabase estiver configurado
    if (typeof window !== "undefined" && isSupabaseConfigured()) {
      fetchAudioFiles()
    }
  }, [])

  const fetchAudioFiles = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("audio_files")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setAudioFiles(data || [])
    } catch (error) {
      console.error("Error fetching audio files:", error)
      setError("Não foi possível carregar os áudios. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      setError(null)
      audioChunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Configurando para qualidade média para reduzir tamanho do arquivo
      const options = {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000, // 128kbps
      }

      const mediaRecorder = new MediaRecorder(stream, options)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          // Atualiza o tamanho estimado do áudio
          setAudioSize((prev) => prev + event.data.size)

          // Verifica se o tamanho está se aproximando do limite
          if (audioSize > MAX_FILE_SIZE * 0.8) {
            setError("Atenção: O áudio está se aproximando do limite de tamanho (4MB)")
          }
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Verifica se o tamanho do arquivo excede o limite
        if (audioBlob.size > MAX_FILE_SIZE) {
          setError("O áudio excede o limite de 4MB. Tente uma gravação mais curta.")
          return
        }

        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)

        if (audioRef.current) {
          audioRef.current.src = url
        }
      }

      // Configura para coletar dados a cada 1 segundo para monitorar o tamanho
      mediaRecorder.start(1000)
      setIsRecording(true)
      setAudioSize(0)

      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setError("Não foi possível iniciar a gravação. Verifique se o microfone está conectado.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioURL) {
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const saveAudio = async () => {
    if (!audioURL) return

    // Se o Supabase não estiver configurado, mostramos um aviso
    if (!isSupabaseConfigured()) {
      setError("Não é possível salvar o áudio. O Supabase não está configurado.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const audioBlob = await fetch(audioURL).then((r) => r.blob())

      // Verifica novamente o tamanho do arquivo
      if (audioBlob.size > MAX_FILE_SIZE) {
        setError("O áudio excede o limite de 4MB. Tente uma gravação mais curta.")
        setIsLoading(false)
        return
      }

      const fileName = `audio_${Date.now()}.webm`

      // Upload to Supabase Storage
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.storage.from("audio").upload(fileName, audioBlob)

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("audio").getPublicUrl(fileName)

      // Save metadata to database
      const { error: dbError } = await supabase.from("audio_files").insert([
        {
          name: fileName,
          url: publicUrl,
          duration: recordingTime,
          size: audioBlob.size,
        },
      ])

      if (dbError) throw dbError

      // Refresh audio files list
      fetchAudioFiles()
    } catch (error) {
      console.error("Error saving audio:", error)
      setError("Não foi possível salvar o áudio. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {!supabaseConfigured && showSupabaseAlert && (
        <Alert className="mb-4 bg-amber-900 border-amber-800 relative">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            Modo de demonstração: O Supabase não está configurado. Você pode gravar e reproduzir áudios, mas não será
            possível salvá-los.
          </AlertDescription>
          <button
            onClick={() => setShowSupabaseAlert(false)}
            className="absolute top-2 right-2 text-amber-200 hover:text-white"
          >
            <X size={16} />
          </button>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-purple-400">Gravação de Áudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full bg-zinc-800 rounded-lg p-6 flex flex-col items-center">
              {audioURL ? (
                <div className="w-full h-24 bg-zinc-700 rounded-lg flex items-center justify-center">
                  <Waveform className="h-16 w-16 text-purple-500" />
                </div>
              ) : (
                <div className="w-full h-24 bg-zinc-700 rounded-lg flex items-center justify-center">
                  <p className="text-zinc-400">Nenhum áudio gravado</p>
                </div>
              )}

              <div className="text-2xl font-mono mt-4 text-white">{formatTime(recordingTime)}</div>

              {audioSize > 0 && (
                <div className="text-sm text-zinc-400 mt-1">Tamanho: {formatFileSize(audioSize)} / 4MB</div>
              )}

              <div className="flex space-x-4 mt-6">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="lg"
                    disabled={isLoading}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Iniciar Gravação
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" size="lg" disabled={isLoading}>
                    <Square className="mr-2 h-5 w-5" />
                    Parar Gravação
                  </Button>
                )}
              </div>

              {audioURL && (
                <div className="w-full mt-6 space-y-4">
                  <div className="flex space-x-4 justify-center">
                    {!isPlaying ? (
                      <Button
                        onClick={playAudio}
                        variant="outline"
                        className="border-purple-500 text-purple-500"
                        disabled={isLoading}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Reproduzir
                      </Button>
                    ) : (
                      <Button
                        onClick={stopAudio}
                        variant="outline"
                        className="border-purple-500 text-purple-500"
                        disabled={isLoading}
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Parar
                      </Button>
                    )}

                    <Button
                      onClick={saveAudio}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading || !supabaseConfigured}
                      title={!supabaseConfigured ? "Supabase não configurado" : ""}
                    >
                      {isLoading ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>

                  <audio ref={audioRef} className="hidden" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {supabaseConfigured && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Biblioteca de Áudios</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">Carregando áudios...</p>
              </div>
            ) : audioFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audioFiles.map((file) => (
                  <Card key={file.id} className="bg-zinc-800 border-zinc-700 overflow-hidden">
                    <div className="p-4 flex items-center space-x-4">
                      <div className="bg-zinc-700 p-3 rounded-full">
                        <Headphones className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{file.name}</h3>
                        <p className="text-sm text-zinc-400">{formatTime(file.duration)}</p>
                        {file.size && <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>}
                      </div>
                      <Button variant="ghost" size="icon" className="text-purple-400">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-400">Nenhum áudio na biblioteca</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
