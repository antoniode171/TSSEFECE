import React, { useState } from 'react';
import { SiteSurvey } from '../types/survey';
import {
  Sparkles,
  Search,
  ExternalLink,
  Send,
  Loader2,
  Copy,
  Check,
  Shield,
  Zap,
  Radio,
  FileCheck,
} from 'lucide-react';

interface TelecomAssistantProps {
  currentSurvey: SiteSurvey;
  onApplyToNotes?: (text: string) => void;
}

interface GroundingSource {
  web?: {
    uri: string;
    title?: string;
  };
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  grounding?: {
    queries?: string[];
    sources?: GroundingSource[];
  };
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: Shield,
    label: 'Norma RETIE Tierra',
    query:
      '¿Cuál es la resistencia máxima de puesta a tierra exigida por norma RETIE en Colombia para estaciones base de telecomunicaciones y qué calibre de conductor se recomienda?',
  },
  {
    icon: Radio,
    label: 'Nokia AirScale Specs',
    query:
      'Especificaciones técnicas oficiales de consumo de potencia DC (-48V), dimensiones y requerimientos de breaker para Nokia AirScale BBU ASIA y tarjeta ABIL 5G.',
  },
  {
    icon: Zap,
    label: 'Cálculo de Breakers DC',
    query:
      '¿Qué calibre AWG de cable de fuerza se debe usar para un breaker de 63A a -48V DC con una distancia de recorrido de 15 metros considerando una caída de tensión máxima del 2%?',
  },
  {
    icon: FileCheck,
    label: 'ODF UPC vs APC',
    query:
      '¿Cuáles son las diferencias de pérdida por retorno y compatibilidad entre conectores de fibra óptica LC/UPC (azul) y SC/APC (verde) en nodos Tigo/Nokia?',
  },
];

export const TelecomAssistant: React.FC<TelecomAssistantProps> = ({
  currentSurvey,
  onApplyToNotes,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hola, soy tu consultor técnico de telecomunicaciones con **Google Search Grounding**. Estoy conectado en tiempo real para verificar normativas vigentes (RETIE, IEEE, MinTIC), especificaciones oficiales de equipos Nokia AirScale, cálculo de alimentadores DC para ${currentSurvey.nombreSitio} y validación de estándares de fibra óptica ODF.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputValue;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/telecom-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          siteContext: {
            nombreSitio: currentSurvey.nombreSitio,
            codigoSitio: currentSurvey.codigoSitio,
            proyecto: currentSurvey.nombreProyecto,
            equipos: currentSurvey.tiposEquipos,
            coordenadas: currentSurvey.coordenadasSitio,
            tipoRack: currentSurvey.tipoRack,
            rectificador: currentSurvey.rectificadorA,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Error al consultar el asistente');
      }

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Sin respuesta obtenida.',
        grounding: data.grounding,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Lo siento, no pude obtener los datos en tiempo real. Por favor verifica la conexión a internet. Detalle: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[650px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">
                Consultor Técnico Telecom (Search Grounding)
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono">
                Gemini 2.5 + Google Search
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
              Sitio activo: {currentSurvey.codigoSitio} · {currentSurvey.nombreSitio}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel for Field Mobile */}
      <div className="p-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              disabled={loading}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-sky-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] md:max-w-[80%] rounded-2xl p-3.5 text-xs ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Search Grounding Citations */}
              {msg.grounding && msg.grounding.sources && msg.grounding.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                  <div className="text-slate-400 font-medium flex items-center gap-1 mb-1.5">
                    <Search className="w-3 h-3 text-sky-400" /> Fuentes verificadas con Google Search:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.grounding.sources.slice(0, 4).map((source, sIdx) => {
                      if (!source.web?.uri) return null;
                      return (
                        <a
                          key={sIdx}
                          href={source.web.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 truncate max-w-[200px]"
                        >
                          <span className="truncate">{source.web.title || source.web.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message footer actions */}
              {msg.sender === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-slate-200 transition flex items-center gap-1"
                      title="Copiar respuesta"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar
                        </>
                      )}
                    </button>
                    {onApplyToNotes && (
                      <button
                        onClick={() => onApplyToNotes(msg.text)}
                        className="hover:text-sky-400 transition"
                      >
                        Insertar en Observaciones
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-950 border border-slate-800 rounded-xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Consultando Google Search y normativas técnicas...</span>
          </div>
        )}
      </div>

      {/* Input container */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregunta sobre normativas RETIE, Nokia 5G, calibres AWG..."
            className="flex-1 text-sm md:text-xs py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="h-10 w-10 md:h-9 md:w-9 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center shrink-0 transition shadow-md shadow-sky-600/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
