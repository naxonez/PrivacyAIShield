console.log('🔒 PrivacyAIShield cargado');

// Patrones MEJORADOS basados en formatos reales
const SENSITIVE_PATTERNS = {
  password: /(?:password|passwd|pwd|contraseña|clave)(?:\s*[:=]\s*["']?([^\s"']{4,20})["']?|\s+es\s+["']?([^\s"']{4,20})["']?)/gi,
  secretKey: /\b(sk-[a-zA-Z0-9]{20,50}|[a-zA-Z0-9]{32,64}|bearer\s+[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+)\b/gi,
  creditCard: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/,
  iban: /\b([A-Z]{2}\d{2}[\s\-]?(?:[A-Z0-9]{4}[\s\-]?){2,}[A-Z0-9]{1,4})\b/gi,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+?\(?\d{1,3}\)?[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,4}\b/g,
  documentId: /\b(\d{8}[A-Z]|[A-Z]\d{7}[A-Z]|[A-Z]{2}\d{7}|\d{3}[-.\s]?\d{2}[-.\s]?\d{4})\b/gi,
  bankAccount: /\b\d{10,20}\b/g
};

// Configuraciones específicas por plataforma
const PLATFORM_CONFIGS = {
  'chatgpt.com': {
    name: 'ChatGPT',
    textareaSelectors: [
      '#prompt-textarea',
      'textarea[data-id]',
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="Message"]',
      'textarea[id*="prompt"]',
      'div[contenteditable="true"]',
      '[data-testid*="text-input"]',
      '.text-input textarea',
      'form textarea'
    ],
    buttonSelectors: [
      'button[data-testid*="send"]',
      'button[data-testid*="submit"]',
      'button:has(svg)',
      'button[class*="send"]',
      'button[class*="submit"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="Enviar"]',
      '[data-testid*="send-button"]',
      'button:has(path[d*="m2.5"])',
      'button:has(path[d*="M.5 1.163a1"])',
      'button[class*="absolute p-1 rounded-md"]',
      'button[class*="flex items-center justify-center"]',
      'button'
    ]
  },
  'chat.openai.com': {
    name: 'ChatGPT',
    textareaSelectors: [
      '#prompt-textarea',
      'textarea[data-id]',
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="Message"]',
      'div[contenteditable="true"]'
    ],
    buttonSelectors: [
      'button[data-testid*="send"]',
      'button:has(svg)',
      'button[class*="send"]',
      'button:has(path[d*="m2.5"])',
      'button'
    ]
  },
  'gemini.google.com': {
    name: 'Google Gemini',
    textareaSelectors: [
      'textarea[placeholder*="Enter a prompt"]',
      'textarea[aria-label*="Enter a prompt"]',
      'textarea[class*="input"]',
      '[contenteditable="true"]',
      '.ql-editor'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      'button:has(svg)',
      'button[aria-label*="Enviar"]'
    ]
  },
  'claude.ai': {
    name: 'Claude AI',
    textareaSelectors: [
      'textarea[placeholder*="Message Claude"]',
      'textarea[class*="message"]',
      'textarea[class*="input"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      'button:has(svg)'
    ]
  },
  'copilot.microsoft.com': {
    name: 'Microsoft Copilot',
    textareaSelectors: [
      'textarea[placeholder*="Ask me anything"]',
      'textarea[id*="searchbox"]',
      'textarea[class*="input"]',
      '#searchbox'
    ],
    buttonSelectors: [
      'button[aria-label*="Submit"]',
      'button[class*="submit"]',
      'button[aria-label*="Search"]',
      'button[title*="Submit"]'
    ]
  },
  'bing.com': {
    name: 'Microsoft Copilot',
    textareaSelectors: [
      'textarea[placeholder*="Ask me anything"]',
      'textarea[id*="searchbox"]',
      '#searchbox',
      '#sb_form_q'
    ],
    buttonSelectors: [
      'button[aria-label*="Search"]',
      'button[class*="search"]',
      '#search_icon'
    ]
  },
  'meta.ai': {
    name: 'Meta AI',
    textareaSelectors: [
      'textarea[placeholder*="Message"]',
      'textarea[class*="input"]',
      '[contenteditable="true"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      'button:has(svg)'
    ]
  },
  'www.meta.ai': {
    name: 'Meta AI',
    textareaSelectors: [
      'textarea[placeholder*="Message"]',
      'textarea[class*="input"]',
      '[contenteditable="true"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      'button:has(svg)'
    ]
  },
  'chat.deepseek.com': {
    name: 'DeepSeek',
    textareaSelectors: [
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="Message"]',
      'textarea[class*="chat"]'
    ],
    buttonSelectors: [
      'button:has(svg)',
      'button[class*="send"]'
    ]
  },
  'perplexity.ai': {
    name: 'Perplexity AI',
    textareaSelectors: [
      'textarea[placeholder*="Ask anything"]',
      'textarea[class*="search"]',
      'textarea[class*="query"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Submit"]',
      'button[class*="submit"]',
      'button[aria-label*="Ask"]'
    ]
  },
  'you.com': {
    name: 'You.com',
    textareaSelectors: [
      'textarea[placeholder*="Ask"]',
      'textarea[class*="input"]',
      '#search-input'
    ],
    buttonSelectors: [
      'button[aria-label*="Search"]',
      'button[class*="search"]',
      '#search-button'
    ]
  },
  'poe.com': {
    name: 'Poe',
    textareaSelectors: [
      'textarea[placeholder*="Message"]',
      'textarea[class*="chat"]',
      'textarea[class*="message"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      'button:has(svg)'
    ]
  },
  'x.ai': {
    name: 'Grok',
    textareaSelectors: [
      'textarea[placeholder*="Message"]',
      'textarea[class*="input"]',
      '[contenteditable="true"]',
      '.chat-input',
      '#message-input'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      '.send-button',
      '#send-message',
      'button:has(svg)',
      'button'
    ]
  },
  'groq.com': {
    name: 'Groq',
    textareaSelectors: [
      'textarea[placeholder*="Message"]',
      'textarea[class*="input"]',
      '#chat-input',
      '[contenteditable="true"]'
    ],
    buttonSelectors: [
      'button[aria-label*="Send"]',
      'button[class*="send"]',
      '#send-button',
      'button:has(svg)',
      'button'
    ]
  }
};

class AISecurityBlocker {
  constructor() {
    this.isBlockingEnabled = true;
    this.isOurModalOpen = false;
    this.currentPlatform = this.detectPlatform();
    this.init();
  }

  detectPlatform() {
    const hostname = window.location.hostname;
    console.log('🌐 Detectando plataforma:', hostname);
    
    for (const [domain, config] of Object.entries(PLATFORM_CONFIGS)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        console.log('✅ Plataforma detectada:', config.name);
        return config;
      }
    }
    
    for (const [domain, config] of Object.entries(PLATFORM_CONFIGS)) {
      if (hostname.includes(domain)) {
        console.log('✅ Plataforma detectada (parcial):', config.name);
        return config;
      }
    }
    
    console.log('🔍 Usando configuración genérica');
    return {
      name: 'AI Chat',
      textareaSelectors: [
        'textarea',
        '[contenteditable="true"]',
        '[role="textbox"]',
        '[id*="input"]',
        '[id*="prompt"]',
        '[class*="input"]',
        '[class*="message"]',
        '.chat-input',
        '#chat-input'
      ],
      buttonSelectors: [
        'button:has(svg)',
        'button[aria-label*="send"]',
        'button[aria-label*="submit"]',
        'button[class*="send"]',
        'button[class*="submit"]',
        'button[class*="search"]',
        'button[id*="send"]',
        'button[id*="submit"]',
        '.send-button',
        '#send-button',
        'button'
      ]
    };
  }

  init() {
    console.log(`🔄 Inicializando PrivacyAIShield para ${this.currentPlatform.name}...`);
    this.createWarningOverlay();
    this.setupPlatformSpecificInterception();
    this.loadSettings();
  }

  setupPlatformSpecificInterception() {
    console.log('🎯 Configurando intercepción específica para', this.currentPlatform.name);
    
    this.interceptMainTextarea();
    this.interceptAllClicks();
    this.interceptKeyboard();
    this.monitorDOMChanges();
  }

  interceptMainTextarea() {
    const textarea = this.findMainTextarea();
    if (textarea) {
      console.log('🎯 Textarea principal encontrado:', textarea);
      
      // Interceptar Enter
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          console.log('⌨️ Enter detectado en textarea principal');
          if (this.checkAndBlock()) {
            e.preventDefault();
            e.stopPropagation();
            this.cleanupImmediately();
          }
        }
      });

      // Interceptar cambios
      textarea.addEventListener('input', (e) => {
        this.currentContent = this.getTextareaContent(textarea);
      });
    } else {
      console.log('⏳ Textarea no encontrado, reintentando en 1 segundo...');
      setTimeout(() => this.interceptMainTextarea(), 1000);
    }
  }

  findMainTextarea() {
    console.log('🔍 Buscando textarea con selectores:', this.currentPlatform.textareaSelectors);
    
    for (const selector of this.currentPlatform.textareaSelectors) {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`✅ Encontrado con selector: ${selector} (${elements.length} elementos)`);
          // Devolver el primer elemento visible
          for (let element of elements) {
            if (this.isElementVisible(element)) {
              console.log('✅ Elemento visible encontrado:', element);
              return element;
            }
          }
          return elements[0];
        }
      } catch (error) {
        console.log(`⚠️ Error con selector ${selector}:`, error);
      }
    }
    
    // Fallback: buscar cualquier textarea o contenteditable visible
    const allInputs = document.querySelectorAll('textarea, [contenteditable="true"]');
    console.log(`🔍 Elementos encontrados (fallback): ${allInputs.length}`);
    
    for (let input of allInputs) {
      if (this.isElementVisible(input)) {
        console.log('✅ Elemento de entrada encontrado (fallback):', input);
        return input;
      }
    }
    
    console.log('❌ No se encontró ningún elemento de entrada visible');
    return null;
  }

  getTextareaContent(textarea) {
    if (!textarea) return '';
    
    if (textarea.tagName === 'TEXTAREA') {
      return textarea.value || '';
    } else if (textarea.getAttribute('contenteditable') === 'true') {
      return textarea.textContent || textarea.innerText || '';
    }
    return '';
  }

  isElementVisible(element) {
    if (!element) return false;
    
    try {
      const style = window.getComputedStyle(element);
      const isVisible = style.display !== 'none' && 
                       style.visibility !== 'hidden' && 
                       element.offsetWidth > 0 && 
                       element.offsetHeight > 0;
      
      return isVisible;
    } catch (error) {
      console.log('⚠️ Error verificando visibilidad:', error);
      return false;
    }
  }

  interceptAllClicks() {
    console.log('🖱️ Interceptando todos los clics...');
    
    // Interceptar clics en capture phase para atraparlos antes
    document.addEventListener('click', (e) => {
      this.handleAnyClick(e);
    }, true);
    
    // También interceptar mousedown por si acaso
    document.addEventListener('mousedown', (e) => {
      if (this.isPotentialSendButton(e.target) && 
          !this.isOurModalButton(e.target) && 
          !this.isTextarea(e.target)) {
        console.log('🖱️ Clic potencial en botón de enviar (mousedown)');
        if (this.checkAndBlock()) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.cleanupImmediately();
        }
      }
    }, true);
  }

  isTextarea(element) {
    if (!element) return false;
    
    let current = element;
    
    while (current && current !== document.body) {
      if (current.tagName === 'TEXTAREA' || current.getAttribute?.('contenteditable') === 'true') {
        return true;
      }
      current = current.parentElement;
    }
    
    return false;
  }

  isOurModalButton(element) {
    if (!element) return false;
    
    let current = element;
    
    while (current && current !== document.body) {
      if (current.id === 'close-warning' || 
          current.classList?.contains('security-modal') ||
          current.id === 'security-blocker-overlay') {
        return true;
      }
      current = current.parentElement;
    }
    
    return false;
  }

  isPotentialSendButton(element) {
    if (!element) return false;
    
    let current = element;
    
    while (current && current !== document.body) {
      const tag = current.tagName?.toLowerCase() || '';
      const ariaLabel = current.getAttribute?.('aria-label')?.toLowerCase() || '';
      const id = current.id?.toLowerCase() || '';
      
      // Manejar className de forma segura - CORRECCIÓN DEL ERROR
      let className = '';
      if (typeof current.className === 'string') {
        className = current.className.toLowerCase();
      } else if (current.className && typeof current.className === 'object') {
        // Para elementos con className como DOMTokenList
        className = current.className.toString().toLowerCase();
      }
      
      // Excluir nuestro modal y textareas
      if (current.id === 'security-blocker-overlay' || 
          current.classList?.contains('security-modal') ||
          tag === 'textarea' ||
          current.getAttribute?.('contenteditable') === 'true') {
        return false;
      }
      
      // Verificar selectores específicos de la plataforma
      const isPlatformButton = this.currentPlatform.buttonSelectors.some(selector => {
        try {
          return current.matches?.(selector) || false;
        } catch (e) {
          return false;
        }
      });
      
      const isSendButton = (
        isPlatformButton ||
        (tag === 'button' && !this.isTextareaButton(current)) ||
        ariaLabel.includes('send') ||
        ariaLabel.includes('submit') ||
        ariaLabel.includes('search') ||
        id.includes('send') ||
        id.includes('submit') ||
        className.includes('send') ||
        className.includes('submit') ||
        (this.isNearTextarea(current) && tag !== 'textarea')
      );
      
      if (isSendButton) {
        console.log('✅ Elemento identificado como botón de enviar:', {
          tag: current.tagName,
          id: current.id,
          class: className,
          ariaLabel: ariaLabel
        });
        return true;
      }
      
      current = current.parentElement;
    }
    
    return false;
  }

  isTextareaButton(element) {
    if (!element) return false;
    
    // Manejar className de forma segura
    let className = '';
    if (typeof element.className === 'string') {
      className = element.className.toLowerCase();
    } else if (element.className && typeof element.className === 'object') {
      className = element.className.toString().toLowerCase();
    }
    
    const textFormatButtons = ['bold', 'italic', 'underline', 'link', 'image', 'code', 'format'];
    return textFormatButtons.some(button => className.includes(button));
  }

  isNearTextarea(element) {
    const textarea = this.findMainTextarea();
    if (!textarea) return false;
    
    try {
      const elementRect = element.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      const distance = Math.abs(elementRect.bottom - textareaRect.bottom);
      
      return distance < 100;
    } catch (error) {
      return false;
    }
  }

  handleAnyClick(event) {
    if (!this.isBlockingEnabled) return;
    
    // Excluir clics en nuestro modal y textareas
    if (this.isOurModalButton(event.target) || this.isTextarea(event.target)) {
      return;
    }
    
    if (this.isPotentialSendButton(event.target)) {
      console.log('🎯 Clic interceptado en elemento de envío');
      
      if (this.checkAndBlock()) {
        console.log('🚫 Bloqueando clic');
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.cleanupImmediately();
        return false;
      }
    }
  }

  interceptKeyboard() {
    document.addEventListener('keydown', (e) => {
      const isTextarea = e.target?.tagName === 'TEXTAREA' || 
                         e.target?.getAttribute?.('contenteditable') === 'true';
      
      if (isTextarea) {
        if (e.key === 'Enter' && !e.shiftKey) {
          console.log('⌨️ Enter detectado en textarea');
          if (this.checkAndBlock()) {
            e.preventDefault();
            e.stopPropagation();
            this.cleanupImmediately();
          }
        }
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        console.log('⌨️ Ctrl+Enter detectado');
        if (this.checkAndBlock()) {
          e.preventDefault();
          e.stopPropagation();
          this.cleanupImmediately();
        }
      }
    }, true);
  }

  monitorDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldReconnect = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.tagName === 'TEXTAREA' || node.querySelector?.('textarea') || 
                  node.getAttribute?.('contenteditable') === 'true') {
                shouldReconnect = true;
              }
              if (node.tagName === 'BUTTON' || node.querySelector?.('button')) {
                shouldReconnect = true;
              }
            }
          });
        }
      });
      
      if (shouldReconnect) {
        console.log('🔄 DOM cambiado - reconectando...');
        setTimeout(() => {
          this.setupPlatformSpecificInterception();
        }, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkAndBlock() {
    if (!this.isBlockingEnabled) {
      console.log('🔓 Protección desactivada');
      return false;
    }
    
    const textarea = this.findMainTextarea();
    if (!textarea) {
      console.log('❌ Textarea no encontrado para verificación');
      return false;
    }
    
    const content = this.getTextareaContent(textarea);
    if (!content.trim()) {
      console.log('❌ Contenido vacío');
      return false;
    }
    
    console.log('🔍 Verificando contenido:', content.substring(0, 100));
    
    const sensitiveData = this.checkForSensitiveInfo(content);
    if (sensitiveData.length > 0) {
      console.log('🚨 Contenido sensible detectado:', sensitiveData);
      this.showBlockWarning(sensitiveData);
      return true;
    }
    
    return false;
  }

  cleanupImmediately() {
    const textarea = this.findMainTextarea();
    if (textarea) {
      if (textarea.tagName === 'TEXTAREA') {
        textarea.value = '';
      } else if (textarea.getAttribute('contenteditable') === 'true') {
        textarea.textContent = '';
        textarea.innerHTML = '';
      }
      textarea.focus();
      console.log('🧹 Textarea limpiado inmediatamente');
    }
  }

  checkForSensitiveInfo(text) {
    const detected = [];
    
    for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
      try {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
          // Filtrar falsos positivos
          const validMatches = matches.filter(match => this.isValidSensitiveData(type, match));
          
          if (validMatches.length > 0) {
            console.log(`✅ ${type.toUpperCase()} detectado:`, validMatches);
            detected.push({
              type: type,
              matches: validMatches.slice(0, 3)
            });
          }
        }
      } catch (error) {
        console.log(`⚠️ Error verificando patrón ${type}:`, error);
      }
    }
    
    return detected;
  }

  isValidSensitiveData(type, match) {
    try {
      switch(type) {
        case 'creditCard':
          return this.isValidCreditCard(match);
        case 'documentId':
          return this.isValidDocumentId(match);
        case 'bankAccount':
          return this.isValidBankAccount(match);
        case 'phone':
          return this.isValidPhone(match);
        default:
          return true;
      }
    } catch (error) {
      console.log('⚠️ Error validando dato sensible:', error);
      return false;
    }
  }

  isValidCreditCard(number) {
    const cleanNumber = number.replace(/[\s-]/g, '');
    if (/^0+$/.test(cleanNumber)) return false;
    return this.luhnCheck(cleanNumber);
  }

  luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  isValidDocumentId(doc) {
    const cleanDoc = doc.replace(/[\s-.]/g, '');
    
    // DNI español: 8 dígitos + letra
    if (/^\d{8}[A-Z]$/.test(cleanDoc)) {
      const numbers = cleanDoc.substring(0, 8);
      const letter = cleanDoc.substring(8, 9);
      const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      return validLetters[numbers % 23] === letter;
    }
    
    // NIE español: letra + 7 dígitos + letra
    if (/^[XYZ]\d{7}[A-Z]$/.test(cleanDoc)) {
      const firstLetter = cleanDoc.substring(0, 1);
      const numbers = cleanDoc.substring(1, 8);
      const lastLetter = cleanDoc.substring(8, 9);
      const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      
      let number = numbers;
      if (firstLetter === 'X') number = '0' + numbers;
      if (firstLetter === 'Y') number = '1' + numbers;
      if (firstLetter === 'Z') number = '2' + numbers;
      
      return validLetters[number % 23] === lastLetter;
    }
    
    // Seguridad social americano (formato básico)
    if (/^\d{3}-?\d{2}-?\d{4}$/.test(doc)) {
      return true;
    }
    
    return false;
  }

  isValidBankAccount(number) {
    const cleanNumber = number.replace(/[\s-]/g, '');
    
    if (/^0+$/.test(cleanNumber) || 
        /^1+$/.test(cleanNumber) ||
        /^123456789/.test(cleanNumber) ||
        /^987654321/.test(cleanNumber)) {
      return false;
    }
    
    return cleanNumber.length >= 10 && cleanNumber.length <= 20;
  }

  isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s+()-]/g, '');
    
    if (cleanPhone.length < 7 || cleanPhone.length > 15) return false;
    if (/(\d)\1{7,}/.test(cleanPhone)) return false;
    
    return true;
  }

  createWarningOverlay() {
    // Remover overlay existente si hay uno
    const existingOverlay = document.getElementById('security-blocker-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    this.warningOverlay = document.createElement('div');
    this.warningOverlay.id = 'security-blocker-overlay';
    this.warningOverlay.innerHTML = `
      <div class="security-modal">
        <div class="security-icon">🛡️</div>
        <h2>Alerta de Seguridad</h2>
        <div class="security-platform">${this.currentPlatform.name}</div>
        <div class="security-details" id="sensitive-details"></div>
        <p>Se detectó información sensible. El mensaje no se enviará.</p>
        <button id="close-warning">✅ Entendido</button>
      </div>
    `;

    const styles = `
      #security-blocker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2147483647;
        font-family: Arial, sans-serif;
      }
      
      .security-modal {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      
      .security-icon {
        font-size: 50px;
        margin-bottom: 15px;
      }
      
      .security-modal h2 {
        color: #d32f2f;
        margin-bottom: 10px;
      }
      
      .security-platform {
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
        font-style: italic;
      }
      
      .security-details {
        background: #fff3f3;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: left;
        border-left: 4px solid #d32f2f;
      }
      
      #close-warning {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        background: #d32f2f;
        color: white;
        margin-top: 15px;
      }
      
      #close-warning:hover {
        background: #c62828;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(this.warningOverlay);

    // Configurar el evento del botón "Entendido"
    document.getElementById('close-warning').addEventListener('click', (e) => {
      console.log('✅ Botón Entendido clickeado - cerrando modal');
      this.hideWarning();
    });
  }

  showBlockWarning(sensitiveData) {
    console.log('🚨 Mostrando advertencia de bloqueo');
    this.isOurModalOpen = true;
    
    const detailsDiv = document.getElementById('sensitive-details');
    detailsDiv.innerHTML = '<strong>Información sensible detectada:</strong><br>';
    
    // Agrupar por tipo para mejor visualización
    const groupedData = {};
    sensitiveData.forEach(item => {
      if (!groupedData[item.type]) {
        groupedData[item.type] = [];
      }
      groupedData[item.type].push(...item.matches);
    });
    
    // Mostrar cada tipo
    Object.entries(groupedData).forEach(([type, matches]) => {
      const uniqueMatches = [...new Set(matches)].slice(0, 3);
      
      const itemDiv = document.createElement('div');
      itemDiv.style.margin = '10px 0';
      itemDiv.style.padding = '10px';
      itemDiv.style.background = '#fff';
      itemDiv.style.borderRadius = '6px';
      itemDiv.style.border = '1px solid #ffcdd2';
      
      itemDiv.innerHTML = `
        <strong style="color: #d32f2f;">${this.getTypeName(type)}</strong><br>
        <small style="color: #666;">
          ${uniqueMatches.map(match => this.maskSensitiveData(match)).join('<br>')}
        </small>
      `;
      detailsDiv.appendChild(itemDiv);
    });
    
    this.warningOverlay.style.display = 'flex';
  }

  hideWarning() {
    console.log('🔒 Cerrando modal de advertencia');
    this.isOurModalOpen = false;
    this.warningOverlay.style.display = 'none';
  }

  maskSensitiveData(text) {
    if (!text || text.length <= 8) return '***';
    return text.substring(0, 4) + '***' + text.substring(text.length - 4);
  }

  getTypeName(type) {
    const names = {
      password: '🔒 Contraseña',
      secretKey: '🔑 Clave API/Token',
      creditCard: '💳 Tarjeta de Crédito',
      iban: '🏦 IBAN',
      email: '📧 Email',
      phone: '📞 Teléfono',
      documentId: '🆔 Documento',
      bankAccount: '🏦 Cuenta Bancaria'
    };
    return names[type] || type;
  }

  loadSettings() {
    chrome.storage.local.get(['blockingEnabled'], (result) => {
      this.isBlockingEnabled = result.blockingEnabled !== false;
      console.log(`🔧 Protección ${this.isBlockingEnabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
    });
  }
}

// Inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiSecurityBlocker = new AISecurityBlocker();
  });
} else {
  window.aiSecurityBlocker = new AISecurityBlocker();
}

// Comunicación con popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBlocking") {
    const blocker = window.aiSecurityBlocker;
    if (blocker) {
      blocker.isBlockingEnabled = request.enabled;
      console.log(`🔧 Protección ${request.enabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
    }
  }
});