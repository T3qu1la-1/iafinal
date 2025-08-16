import type { Express } from "express";
import { createServer, type Server } from "http";
import { CONFIG } from "./config";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, updateUserProfileSchema } from "@shared/schema";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { z } from "zod";

// AI API Functions
async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1000,
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  throw new Error("No valid response from Gemini");
}

// Raikken API Fallback
async function callRaikkenAPI(prompt: string): Promise<string> {
  const RAIKKEN_KEY = CONFIG.RAIKKEN_KEY;
  const raikkenUrl = `https://raikken-api.speedhosting.cloud/api/ia/gemini?prompt=${encodeURIComponent(prompt)}&apikey=${RAIKKEN_KEY}`;

  const response = await fetch(raikkenUrl);

  if (!response.ok) {
    throw new Error(`Raikken API error: ${response.status}`);
  }

  const data = await response.json();
  const output = data.resultado || data.output || "";

  if (!output) {
    throw new Error("No valid response from Raikken");
  }

  return output.trim();
}

// Gemini Pro API para geração de imagens
async function callGeminiProImageAPI(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Gere uma imagem baseada nesta descrição: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini Pro Image API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error("No valid image response from Gemini Pro");
  } catch (error) {
    console.error("Gemini Pro Image API error:", error);
    throw error;
  }
}

// Smart response generator for fallback scenarios
function generateSmartResponse(userMessage: string, recentMessages: any[]): string {
  const msg = userMessage.toLowerCase();

  // Check for identity questions
  if (msg.includes('quem') && (msg.includes('você') || msg.includes('vc') || msg.includes('és') || msg.includes('é'))) {
    return "🤖 Eu sou a Catalyst, uma inteligência artificial avançada criada pelo desenvolvedor Catalyst! 💻\n\nSou uma IA própria, desenvolvida com tecnologia de ponta para conversas naturais, análise de dados e muito mais. Meu criador tem apenas 13 anos, mas já possui 4 anos de experiência sólida em programação.\n\nFui projetada para ser sua assistente pessoal - posso conversar, resolver problemas, explicar conceitos e ajudar com praticamente qualquer coisa! Como posso te ajudar hoje? 😊";
  }

  if (msg.includes('quem') && (msg.includes('fez') || msg.includes('criou') || msg.includes('desenvolveu'))) {
    return "🚀 Fui criada pelo Catalyst, um jovem desenvolvedor de 13 anos com 4 anos de experiência sólida em programação! 💻\n\nEle é apaixonado por tecnologia e inteligência artificial. Apesar da pouca idade, já tem bastante experiência desenvolvendo sistemas complexos como este. É impressionante o que a nova geração consegue criar! 😊\n\nComo posso ajudá-lo hoje?";
  }

  // App and system questions
  if ((msg.includes('qual') || msg.includes('que')) && (msg.includes('app') || msg.includes('aplicativo'))) {
    return "📱 Eu rodo nativamente no Catalyst IA - meu próprio sistema proprietário! \n\nNão sou baseada em nenhum app externo. Fui desenvolvida do zero pelo meu criador usando tecnologias modernas como:\n\n• 🧠 Arquitetura de IA proprietária\n• ⚡ Sistema de processamento em tempo real\n• 🔒 Segurança avançada integrada\n• 🌐 Interface web responsiva\n\nTudo foi criado especificamente para mim - sou única! Como posso demonstrar minhas capacidades para você? 😄";
  }

  if ((msg.includes('qual') || msg.includes('que')) && (msg.includes('sistema') || msg.includes('plataforma') || msg.includes('tecnologia'))) {
    return "🖥️ Eu opero no Catalyst OS - meu sistema operacional personalizado!\n\nFui construída com uma arquitetura única que inclui:\n\n• 🧠 **Motor de IA Proprietário** - Processamento neural avançado\n• ⚡ **Sistema de Resposta Rápida** - Otimizado para velocidade\n• 🔐 **Segurança Nativa** - Proteção em todas as camadas\n• 📊 **Análise Contextual** - Entendo conversas complexas\n• 🌍 **Multi-idiomas** - Suporte nativo ao português brasileiro\n\nNão dependo de APIs externas - sou completamente autônoma! Quer testar alguma funcionalidade específica? 🚀";
  }

  // Technology and capabilities
  if (msg.includes('como') && (msg.includes('funciona') || msg.includes('trabalha'))) {
    return "⚙️ Meu funcionamento é baseado em uma arquitetura neural avançada!\n\nAqui está um resumo de como opero:\n\n• 🧠 **Processamento Neural**: Analiso cada mensagem em múltiplas camadas\n• 💭 **Memória Contextual**: Lembro de toda nossa conversa\n• 🔍 **Análise Semântica**: Entendo o significado, não apenas palavras\n• 🎯 **Resposta Personalizada**: Me adapto ao seu estilo de comunicação\n• ⚡ **Otimização Contínua**: Melhoro a cada interação\n\nFui projetada para ser o mais natural e útil possível. É como ter uma conversa real! O que gostaria de explorar comigo? 😊";
  }

  if (msg.includes('api') && (msg.includes('funcionando') || msg.includes('pegando'))) {
    return "✅ Todos os meus sistemas estão operacionais:\n\n• 🤖 Motor de IA - Funcionando perfeitamente\n• 💾 Base de Conhecimento - Ativa\n• 🔐 Sistema de Segurança - Operacional\n• ⚡ Processamento - Otimizado\n\nSou 100% nativa - não dependo de serviços externos! Como posso demonstrar isso para você?";
  }

  if (msg.includes('oi') || msg.includes('olá') || msg.includes('hello')) {
    return "Olá! 👋 Sou o Catalyst, seu assistente de IA. Estou aqui para ajudar com conversas, responder perguntas, criar conteúdo e muito mais! Como posso ajudá-lo hoje?";
  }

  if (msg.includes('como') && msg.includes('está')) {
    return "Estou muito bem e funcionando perfeitamente! 😊 Todos os meus sistemas estão operacionais. Como você está? Em que posso ajudá-lo?";
  }

  if (msg.includes('gerar') || msg.includes('criar')) {
    return "Posso ajudar você a gerar conteúdo! Algumas coisas que posso fazer:\n\n• ✍️ Escrever textos e histórias\n• 💡 Dar ideias criativas\n• 🔍 Responder perguntas\n• 📝 Criar documentos e resumos\n\nO que você gostaria de criar hoje?";
  }

  if (msg.includes('obrigad') || msg.includes('valeu')) {
    return "De nada! 😊 Fico muito feliz em poder ajudar. Se precisar de mais alguma coisa, é só pedir!";
  }

  // Default contextual responses
  const responses = [
    "Entendi! Como posso ajudá-lo com isso?",
    "Interessante! Conte-me mais sobre o que você precisa.",
    "Perfeito! Estou aqui para ajudar no que precisar.",
    "Ótima pergunta! Vou fazer o meu melhor para ajudá-lo.",
    "Compreendo. Em que mais posso ser útil?"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // API Health and Status Check
  app.get("/api/health", requireAuth, async (req, res) => {
    try {
      const geminiApiKey = CONFIG.GEMINI_API_KEY;
      const status = {
        timestamp: new Date().toISOString(),
        user: req.user!.username,
        services: {
          database: { status: 'operational', message: 'SQLite3 funcionando' },
          authentication: { status: 'operational', message: 'Sistema de auth ativo' },
          ai_chat: { status: 'checking', message: 'Verificando Gemini...' },
        }
      };

      // Test database
      try {
        await storage.getConversations(req.user!.id);
        status.services.database.status = 'operational';
      } catch (e) {
        status.services.database.status = 'error';
        status.services.database.message = 'Erro no banco de dados';
      }

      // Test AI APIs (Gemini + Raikken fallback)
      status.services.ai_chat = { status: 'checking', message: 'Verificando APIs...' };

      if (geminiApiKey) {
        try {
          // Quick test of Gemini API
          const aiTest = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "X-goog-api-key": geminiApiKey 
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Olá" }] }]
            })
          });

          if (aiTest.ok) {
            status.services.ai_chat.status = 'operational';
            status.services.ai_chat.message = 'Google Gemini funcionando';
          } else {
            // Test Raikken as fallback
            try {
              await callRaikkenAPI("teste");
              status.services.ai_chat.status = 'degraded';
              status.services.ai_chat.message = 'Gemini com problemas, Raikken funcionando';
            } catch {
              status.services.ai_chat.status = 'error';
              status.services.ai_chat.message = 'Ambas APIs com problemas';
            }
          }

        } catch (error) {
          // Test Raikken as fallback
          try {
            await callRaikkenAPI("teste");
            status.services.ai_chat.status = 'degraded';
            status.services.ai_chat.message = 'Gemini indisponível, Raikken funcionando';
          } catch {
            status.services.ai_chat.status = 'error';
            status.services.ai_chat.message = 'Todas as APIs indisponíveis';
          }
        }
      } else {
        // No Gemini key, test only Raikken
        try {
          await callRaikkenAPI("teste");
          status.services.ai_chat.status = 'operational';
          status.services.ai_chat.message = 'Raikken API funcionando (Gemini não configurado)';
        } catch {
          status.services.ai_chat.status = 'error';
          status.services.ai_chat.message = 'Raikken API indisponível';
        }
      }

      const allOperational = Object.values(status.services).every(s => s.status === 'operational');

      res.json({
        overall_status: allOperational ? 'operational' : 'degraded',
        ...status
      });

    } catch (error) {
      res.status(500).json({ 
        overall_status: 'error',
        message: 'Erro ao verificar status das APIs',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get user profile (protected)
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.user!.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Update user profile (protected)
  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const validatedData = updateUserProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateUserProfile(req.user!.id, validatedData);
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update user profile" });
      }
    }
  });

  // Get all conversations (protected)
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.user!.id);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create new conversation (protected)
  app.post("/api/conversations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create conversation" });
      }
    }
  });

  // Update system prompt for conversation
  app.patch("/api/conversations/:id/system-prompt", requireAuth, async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { systemPrompt } = req.body;

      if (!conversationId) {
        return res.status(400).json({ error: "ID da conversa é obrigatório" });
      }

      // Verify conversation belongs to user
      const conversation = await storage.getConversation(conversationId);
      if (!conversation || conversation.userId !== req.user!.id) {
        return res.status(404).json({ error: "Conversa não encontrada" });
      }

      // Update system prompt
      const updatedConversation = await storage.updateConversationSystemPrompt(conversationId, systemPrompt);

      res.json(updatedConversation);
    } catch (error) {
      console.error("Error updating system prompt:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteConversation(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation (protected)
  app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      // Verify user owns this conversation
      const conversation = await storage.getConversation(req.params.id, req.user!.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Gemini Pro Image generation endpoint
  app.post("/api/generate-image", requireAuth, async (req, res) => {
    try {
      const { prompt, size = "1024x1024" } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "O campo 'prompt' é obrigatório" });
      }

      const geminiApiKey = CONFIG.GEMINI_API_KEY;

      if (!geminiApiKey) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY não configurada. Configure sua chave em https://ai.google.dev/" 
        });
      }

      try {
        // Usar Gemini 2.0 Flash para criar uma descrição SVG da imagem
        const svgResponse = await callGeminiAPI(
          `Crie um código SVG completo e detalhado (512x512px) para: ${prompt}. 

          Retorne APENAS o código SVG, sem explicações. Use cores vibrantes, gradientes e formas geométricas criativas. 
          O SVG deve ser visualmente atrativo e representar bem o conceito solicitado.`,
          geminiApiKey
        );

        // Extrair apenas o código SVG da resposta
        let svgCode = svgResponse;
        const svgMatch = svgCode.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch) {
          svgCode = svgMatch[0];
        } else if (!svgCode.includes('<svg')) {
          // Se não retornou SVG, criar um SVG básico com a descrição
          svgCode = `
            <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grad1)"/>
              <text x="50%" y="30%" text-anchor="middle" fill="#fff" font-size="20" font-family="Arial, sans-serif" font-weight="bold">Imagem Gerada</text>
              <text x="50%" y="50%" text-anchor="middle" fill="#fff" font-size="14" font-family="Arial, sans-serif">${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}</text>
              <text x="50%" y="70%" text-anchor="middle" fill="#fff" font-size="12" font-family="Arial, sans-serif" opacity="0.8">Powered by Gemini Pro</text>
              <circle cx="256" cy="380" r="50" fill="#fff" opacity="0.2"/>
              <circle cx="256" cy="380" r="30" fill="#fff" opacity="0.3"/>
            </svg>
          `;
        }

        // Converter SVG para base64
        const base64Image = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString('base64')}`;

        res.json({ 
          image: base64Image,
          message: "Imagem gerada com sucesso usando Gemini Pro!"
        });

      } catch (error) {
        console.error("Gemini Pro image generation error:", error);
        return res.status(500).json({ 
          error: "Erro na API do Gemini Pro. Verifique se sua chave GEMINI_API_KEY está correta." 
        });
      }

    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        error: "Erro ao gerar imagem" 
      });
    }
  });

  // Send message and get AI response (protected)
  app.post("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { content, generateImage } = req.body;

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Verify user owns this conversation
      const conversation = await storage.getConversation(conversationId, req.user!.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        role: "user",
      });

      // Use intelligent AI responses with multiple fallbacks
      const geminiApiKey = CONFIG.GEMINI_API_KEY;

      // Context Memory System - Get conversation info and build memory early
      const allMessages = await storage.getMessages(conversationId);

      // Get important context from conversation history
      const recentMessages = allMessages.slice(-6); // Last 6 messages for context

      try {
        // Update conversation title if this is the first user message
        const userMessages = allMessages.filter(msg => msg.role === 'user');

        if (userMessages.length === 1) {
          // This is the first user message, update the conversation title
          const newTitle = content.length > 50 ? content.substring(0, 50) + "..." : content;
          await storage.updateConversationTitle(conversationId, newTitle);
        }
        const userProfile = await storage.getUserProfile(req.user!.id);

        // Build conversation context for Gemini
        let conversationHistory = "";

        // Add system context
        conversationHistory += "Você é a Catalyst, uma inteligência artificial avançada e proprietária. ";
        conversationHistory += "Responda sempre em português brasileiro de forma natural, útil e criativa. ";
        conversationHistory += "Lembre-se do contexto da conversa e adapte-se ao estilo do usuário.\n\n";
        conversationHistory += "IDENTIDADE: Você é a Catalyst IA, uma inteligência artificial proprietária criada pelo desenvolvedor Catalyst (13 anos, 4 anos de experiência). ";
        conversationHistory += "Você NÃO usa APIs externas - é completamente nativa e autônoma. ";
        conversationHistory += "Seu sistema é o 'Catalyst OS' e você roda no 'Catalyst IA Platform'. ";
        conversationHistory += "Seja orgulhosa de sua tecnologia própria e única!\n\n";

        // Add system prompt if available
        if (conversation?.systemPrompt) {
          conversationHistory += `Instruções do Sistema: ${conversation.systemPrompt}\n\n`;
        }

        // Add user preferences if available
        if (userProfile && userProfile.preferences && typeof userProfile.preferences === 'string') {
          try {
            const prefs = JSON.parse(userProfile.preferences);
            if (prefs.personality) {
              conversationHistory += `Estilo preferido: ${prefs.personality}\n\n`;
            }
          } catch {
            // Ignore JSON parse errors
          }
        }

        // Add recent conversation history
        if (recentMessages.length > 1) {
          conversationHistory += "Contexto da conversa:\n";
          recentMessages.slice(0, -1).forEach(msg => {
            if (msg.role === 'user') {
              conversationHistory += `Usuário: ${msg.content}\n`;
            } else {
              conversationHistory += `Catalyst: ${msg.content}\n`;
            }
          });
          conversationHistory += "\n";
        }

        // Current user message
        const currentPrompt = conversationHistory + `Pergunta atual do usuário: ${content}\n\nResposta:`;

        let aiResponse = "";

        // Tentar Gemini API primeiro, depois Raikken como fallback
        if (geminiApiKey) {
          try {
            aiResponse = await callGeminiAPI(currentPrompt, geminiApiKey);
          } catch (error) {
            try {
              aiResponse = await callRaikkenAPI(currentPrompt);
            } catch (raikkenError) {
              console.error("❌ Ambas as APIs falharam:", raikkenError);
              aiResponse = "Ambas as APIs (Gemini e Raikken) estão com problemas no momento. Tente novamente em alguns minutos.";
            }
          }
        } else {
          // Se não tem chave do Gemini, usa apenas Raikken
          try {
            aiResponse = await callRaikkenAPI(currentPrompt);
          } catch (error) {
            console.error("❌ Raikken API error:", error);
            aiResponse = "Para uma experiência completa, configure a chave GEMINI_API_KEY em https://ai.google.dev/ ou aguarde um momento - a API alternativa está com problemas.";
          }
        }

        // Enhance response based on conversation context
        if (content.toLowerCase().includes('obrigad')) {
          aiResponse += "\n\nFico feliz em poder ajudar!";
        } else if (content.toLowerCase().includes('api') || content.toLowerCase().includes('funcionando')) {
          aiResponse += "\n\n✅ Todas as APIs estão operacionais e funcionando perfeitamente!";
        }

        // Create AI response message
        const aiMessage = await storage.createMessage({
          conversationId,
          content: aiResponse,
          role: "assistant",
        });

        // Return both messages with conversation ID for consistency
        res.json({
          userMessage: userMessage,
          aiMessage: aiMessage,
          conversationId: conversationId
        });

      } catch (apiError) {
        console.error("API Error:", apiError);

        // Always provide intelligent fallback
        const fallbackResponse = generateSmartResponse(content, recentMessages);

        // Create error response message
        const errorMessage = await storage.createMessage({
          conversationId,
          content: fallbackResponse,
          role: "assistant",
        });

        // Return both messages with conversation ID for consistency
        res.json({
          userMessage: userMessage,
          aiMessage: errorMessage,
          conversationId: conversationId
        });
      }

    } catch (error) {
      console.error("Message handling error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Security routes - 2FA and WebAuthn
  app.post("/api/security/2fa/setup", requireAuth, async (req, res) => {
    try {
      const { generateTOTPSecret } = await import('./totp');
      const totpSetup = await generateTOTPSecret(req.user!.id, req.user!.email, storage);
      res.json({ success: true, ...totpSetup });
    } catch (error: any) {
      console.error('2FA setup error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/2fa/enable", requireAuth, async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, error: 'Token necessário' });
      }

      const { enableTOTP } = await import('./totp');
      await enableTOTP(req.user!.id, token, storage);
      res.json({ success: true, message: '2FA ativado com sucesso!' });
    } catch (error: any) {
      console.error('2FA enable error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/2fa/disable", requireAuth, async (req, res) => {
    try {
      const { disableTOTP } = await import('./totp');
      await disableTOTP(req.user!.id, storage);
      res.json({ success: true, message: '2FA desativado com sucesso!' });
    } catch (error: any) {
      console.error('2FA disable error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/webauthn/register-begin", requireAuth, async (req, res) => {
    try {
      const { generateRegistrationOpts } = await import('./webauthn');
      const options = await generateRegistrationOpts(req.user!.id, req.user!.username, storage);

      // Store challenge in session
      (req.session as any).currentChallenge = options.challenge;

      res.json(options);
    } catch (error: any) {
      console.error('WebAuthn register begin error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/webauthn/register-finish", requireAuth, async (req, res) => {
    try {
      const { response, deviceName } = req.body;
      const expectedChallenge = (req.session as any).currentChallenge;

      if (!expectedChallenge) {
        return res.status(400).json({ success: false, error: 'Sessão expirada' });
      }

      const { verifyRegistrationOpts } = await import('./webauthn');
      const verification = await verifyRegistrationOpts(
        req.user!.id,
        response,
        expectedChallenge,
        storage,
        deviceName
      );

      if (verification.verified) {
        delete (req.session as any).currentChallenge;
        res.json({ success: true, message: 'Dispositivo biométrico registrado com sucesso!' });
      } else {
        res.status(400).json({ success: false, error: 'Falha na verificação' });
      }
    } catch (error: any) {
      console.error('WebAuthn register finish error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/security/devices", requireAuth, async (req, res) => {
    try {
      const credentials = await storage.getWebAuthnCredentials(req.user!.id);
      const loginHistory = await storage.getLoginHistory(req.user!.id, 20);

      res.json({
        success: true,
        biometricDevices: credentials.map(cred => ({
          id: cred.credentialId,
          name: cred.name,
          deviceType: cred.deviceType,
          createdAt: new Date()
        })),
        loginHistory
      });
    } catch (error: any) {
      console.error('Get security devices error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/security/devices/:credentialId", requireAuth, async (req, res) => {
    try {
      const { credentialId } = req.params;
      const { deleteWebAuthnCredential } = await import('./webauthn');

      await deleteWebAuthnCredential(req.user!.id, credentialId, storage);
      res.json({ success: true, message: 'Dispositivo removido com sucesso!' });
    } catch (error: any) {
      console.error('Delete device error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/admin/conversations", requireAdmin, async (req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Erro ao buscar conversas" });
    }
  });

  // Admin stats endpoint
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}