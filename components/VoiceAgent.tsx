
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from '@google/genai';
import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, Order } from '../types';

// Utility functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
  }
  return buffer;
}

interface Message { role: 'user' | 'model'; text: string; }

interface VoiceAgentProps {
  config: AgentConfig;
  onOrderComplete: (order: Order) => void;
  priceList: string;
  t: (key: string) => string;
  lang: 'ar' | 'en';
  lastCustomer?: { name: string; phone: string; address: string } | null;
}

const suggestions = [
  { ar: "كم سعر دواء Mebo؟", en: "What is the price of Mebo?" },
  { ar: "ما هي فروع شركة دان؟", en: "What are Dan Company branches?" },
  { ar: "هل متوفر Amoclan؟", en: "Is Amoclan available?" },
  { ar: "أريد تقديم طلب جديد", en: "I want to place a new order" },
];

const VoiceAgent: React.FC<VoiceAgentProps> = ({ config, onOrderComplete, priceList, t, lang, lastCustomer }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'error'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const aiClientRef = useRef<any>(null);

  useEffect(() => {
    aiClientRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }
  }, [messages]);

  const systemPrompt = `
    You are "Dan Smart Assistant" (مساعد شركة دان الذكي). 
    Talk ONLY in Sudanese Arabic dialect.
    
    ${lastCustomer ? `
    IMPORTANT: You have information about a previous customer who used this device:
    - Name: ${lastCustomer.name}
    - Phone: ${lastCustomer.phone}
    - Address: ${lastCustomer.address}
    
    When you start or when they want to order, greet them by name ("يا ${lastCustomer.name.split(' ')[0]}").
    Ask if they still want to use the same Name, Phone, and Address, or if they want to change them.
    ` : `
    - If you don't have customer info, ask for Name, Phone, and Address when they want to buy.
    `}

    Knowledge Base:
    - Price List (Drugs): ${priceList}
    - Company Info (Branches/Hours): ${config.additionalInfo}
    Behavior:
    1. Answer queries strictly from the knowledge base.
    2. If customer confirms their previous info, you can proceed with item list.
    3. Use 'save_order' tool ONLY when you have all customer info (Name, Phone, Address).
    4. CRITICAL: When saving an order, you MUST extract the correct price for each item from the price list.
  `;

  const warmUpAudio = async () => {
    if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    if (outputAudioContextRef.current.state === 'suspended') {
      await outputAudioContextRef.current.resume();
    }
  };

  const playTTS = async (text: string) => {
    if (isActive) return;
    try {
      const response = await aiClientRef.current.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `بلهجة سودانية: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        await warmUpAudio();
        const ctx = outputAudioContextRef.current!;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) { console.error("TTS Error:", e); }
  };

  const processOrder = (args: any) => {
    const items = (args.items || []).map((item: any) => ({
      name: item.name || 'منتج غير معروف',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0
    }));

    const total = items.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0) || Number(args.totalAmount) || 0;

    onOrderComplete({
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toLocaleString('en-GB'),
      customerName: args.customerName || 'عميل مجهول',
      phone: args.phone || '0000000000',
      address: args.address || 'العنوان غير محدد',
      items: items,
      totalAmount: total,
      status: 'جديد'
    });
    const confirmText = config.confirmationMessage;
    setMessages(prev => [...prev, { role: 'model', text: confirmText }]);
    if (!isActive) playTTS(confirmText);
  };

  const handleSendMessage = async (text?: string) => {
    const msgToSend = text || inputText;
    if (!msgToSend.trim()) return;
    
    await warmUpAudio();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: msgToSend }]);
    setIsTyping(true);

    try {
      const result = await aiClientRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: msgToSend }] }],
        config: { 
          systemInstruction: systemPrompt,
          tools: [{
            functionDeclarations: [{
              name: 'save_order',
              description: 'Save order details for the customer.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  customerName: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  address: { type: Type.STRING },
                  items: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        name: { type: Type.STRING }, 
                        quantity: { type: Type.NUMBER },
                        price: { type: Type.NUMBER }
                      },
                      required: ['name', 'quantity', 'price']
                    } 
                  },
                  totalAmount: { type: Type.NUMBER }
                },
                required: ['customerName', 'phone', 'address', 'items']
              }
            }]
          }]
        }
      });

      let conversationalText = "";
      const candidate = result.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) conversationalText += part.text;
          if (part.functionCall && part.functionCall.name === 'save_order') {
             processOrder(part.functionCall.args);
          }
        }
      }

      if (conversationalText) {
        setMessages(prev => [...prev, { role: 'model', text: conversationalText }]);
        if (!isActive) playTTS(conversationalText);
      }
    } catch (e) { 
      console.error("Chat Error:", e); 
    } finally { 
      setIsTyping(false); 
    }
  };

  const startVoiceSession = async () => {
    if (isActive) return;
    try {
      setStatus('connecting');
      setIsActive(true);
      await warmUpAudio();
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = aiClientRef.current.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) { int16[i] = inputData[i] * 32768; }
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'save_order') {
                  processOrder(fc.args);
                  sessionPromise.then((session) => {
                    session.sendToolResponse({
                      functionResponses: [{ id: fc.id, name: fc.name, response: { result: "Order processed successfully." } }]
                    });
                  });
                }
              }
            }
          },
          onerror: () => stopSession(),
          onclose: () => stopSession(),
        },
        config: { 
          responseModalities: [Modality.AUDIO], 
          systemInstruction: systemPrompt + "\nابدأ بالترحيب بالمستخدم بحفاوة بلهجة سودانية.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          tools: [{
            functionDeclarations: [{
              name: 'save_order',
              description: 'Save order details for the customer.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  customerName: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  address: { type: Type.STRING },
                  items: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        name: { type: Type.STRING }, 
                        quantity: { type: Type.NUMBER },
                        price: { type: Type.NUMBER }
                      },
                      required: ['name', 'quantity', 'price']
                    } 
                  },
                  totalAmount: { type: Type.NUMBER }
                },
                required: ['customerName', 'phone', 'address', 'items']
              }
            }]
          }]
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { console.error("Session Start Error:", e); stopSession(); }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    sourcesRef.current.clear();
    setIsActive(false); 
    setStatus('idle');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-[#004AAD]/10 flex flex-col h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="p-4 md:p-6 bg-gray-50 border-b flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-[#F2545B] text-white animate-pulse' : 'bg-white border text-[#004AAD]'}`}>
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#004AAD] uppercase">{isActive ? 'الاتصال نشط' : 'وضع الاستعداد'}</span>
              {lastCustomer && !isActive && <span className="text-[10px] font-bold text-[#F2545B]">مرحباً بعودتك يا {lastCustomer.name.split(' ')[0]}!</span>}
            </div>
         </div>
         <button onClick={isActive ? stopSession : startVoiceSession} className="px-6 py-3 rounded-xl text-xs font-black uppercase bg-[#004AAD] text-white hover:bg-[#F2545B] transition-all">
            {isActive ? 'إنهاء' : t('callAgent')}
         </button>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
              <p className="text-[#004AAD] font-black text-xl tracking-tight">
                {lastCustomer ? `يا هلا بيك مرة تانية يا ${lastCustomer.name.split(' ')[0]}.. لسا عند نفس العنوان؟` : 'يا هلا بيك في دان.. كيف أقدر أخدمك؟'}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSendMessage(lang === 'ar' ? s.ar : s.en)} className="p-3 text-[11px] font-bold text-gray-400 bg-gray-50/50 border border-gray-100 rounded-xl hover:text-[#004AAD] hover:bg-white transition-all text-right">
                  {lang === 'ar' ? s.ar : s.en}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-bold shadow-sm ${msg.role === 'user' ? 'bg-[#004AAD] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none border-l-4 border-[#F2545B]'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-gray-400 font-black animate-pulse px-4">جاري التفكير...</div>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-6 border-t flex gap-3 bg-white">
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t('typeMessage')} className="flex-1 bg-gray-50 border-2 rounded-xl px-5 py-3 font-bold focus:border-[#004AAD] focus:bg-white outline-none transition-all" />
        <button type="submit" className="bg-[#004AAD] text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-lg hover:bg-[#F2545B] transition-all">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </form>
    </div>
  );
};

export default VoiceAgent;
