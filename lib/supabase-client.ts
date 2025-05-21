import { createClient } from "@supabase/supabase-js"

// Criamos uma função para obter o cliente Supabase apenas quando necessário
// em vez de inicializá-lo na importação do módulo
let supabaseInstance: ReturnType<typeof createClient> | null = null
let hasWarnedAboutMissingCredentials = false

export default function getSupabaseClient() {
  // Se não estamos no navegador, retornamos um cliente mock
  if (typeof window === "undefined") {
    return getMockClient()
  }

  // Se já temos uma instância, retornamos ela
  if (supabaseInstance) return supabaseInstance

  // Obtemos as variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Se temos as variáveis de ambiente, criamos o cliente real
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (...args) => fetch(...args),
      },
      // Adiciona um timeout para evitar que as requisições fiquem pendentes por muito tempo
      realtime: {
        timeout: 8000, // 8 segundos
      },
    })

    return supabaseInstance
  }

  // Mostra o aviso apenas uma vez para evitar spam no console
  if (!hasWarnedAboutMissingCredentials) {
    console.warn(
      "Modo de demonstração: Supabase URL ou Anon Key não definidos. Algumas funcionalidades estarão limitadas.",
    )
    hasWarnedAboutMissingCredentials = true
  }

  // Se não temos as variáveis de ambiente, retornamos um cliente mock
  return getMockClient()
}

// Função para criar um cliente mock
function getMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg?height=100&width=100" } }),
      }),
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as any
}

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured() {
  // Se não estamos no navegador, retornamos false
  if (typeof window === "undefined") {
    return false
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(supabaseUrl && supabaseAnonKey)
}
