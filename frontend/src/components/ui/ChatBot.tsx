import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, HelpCircle, FileText, Briefcase, Phone } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface QuickAction {
    label: string;
    icon: React.ReactNode;
    message: string;
}

const quickActions: QuickAction[] = [
    { label: 'About BIFPCL', icon: <HelpCircle size={14} />, message: 'Tell me about BIFPCL and the Maitree Project' },
    { label: 'View Tenders', icon: <FileText size={14} />, message: 'What tenders are currently available?' },
    { label: 'Career Info', icon: <Briefcase size={14} />, message: 'Are there any job openings at BIFPCL?' },
    { label: 'Contact', icon: <Phone size={14} />, message: 'How can I contact BIFPCL?' },
];

const welcomeMessage: Message = {
    id: 'welcome',
    content: "Hello! I'm the BIFPCL Assistant. I can help you with information about the Maitree Super Thermal Power Project, tenders, careers, and more. How can I assist you today?",
    role: 'assistant',
    timestamp: new Date(),
};

// Predefined responses for common queries
const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('bifpcl') || lowerQuery.includes('about') || lowerQuery.includes('maitree') || lowerQuery.includes('project')) {
        return "BIFPCL (Bangladesh-India Friendship Power Company Limited) is a 50:50 joint venture between NTPC Ltd. of India and BPDB of Bangladesh. The Maitree Super Thermal Power Project is a 1320 MW ultra-supercritical coal-fired power plant located in Rampal, Bagerhat, Bangladesh. It represents a landmark bilateral cooperation in the power sector.";
    }

    if (lowerQuery.includes('tender') || lowerQuery.includes('bid') || lowerQuery.includes('procurement')) {
        return "You can view all active tenders on our Tenders page at /tenders. We regularly post new procurement opportunities for goods, services, and works. Each tender includes detailed specifications, deadlines, and submission requirements. Would you like me to direct you there?";
    }

    if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('opening') || lowerQuery.includes('vacancy') || lowerQuery.includes('work')) {
        return "BIFPCL offers various career opportunities across engineering, management, and administrative roles. You can view current openings on our Careers page at /careers. We're always looking for talented individuals to join our team in building Bangladesh's energy future.";
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('address') || lowerQuery.includes('office')) {
        return "You can reach BIFPCL through:\n\n**Site Office:**\nMaitree Super Thermal Power Project\nRampal, Bagerhat, Bangladesh\nPhone: +880 2 968 1234\nEmail: info@bifpcl.com\n\n**Corporate Office:**\n117 Kazi Nazrul Islam Ave, Dhaka 1205\nPhone: +880 2 968 5678\n\nOr visit our Contact page at /contact for more options.";
    }

    if (lowerQuery.includes('environment') || lowerQuery.includes('emission') || lowerQuery.includes('pollution') || lowerQuery.includes('green')) {
        return "BIFPCL is committed to environmental sustainability. The Maitree Project uses Ultra-Supercritical Technology ensuring lower emissions and higher efficiency. We strictly adhere to IFC guidelines and Equator Principles. Advanced pollution control systems including FGD (Flue Gas Desulfurization), ESP (Electrostatic Precipitators), and SCR (Selective Catalytic Reduction) are installed.";
    }

    if (lowerQuery.includes('capacity') || lowerQuery.includes('power') || lowerQuery.includes('electricity') || lowerQuery.includes('mw') || lowerQuery.includes('megawatt')) {
        return "The Maitree Super Thermal Power Project has a total installed capacity of 1320 MW (2 x 660 MW units). It uses ultra-supercritical technology for maximum efficiency and minimal environmental impact. The plant significantly contributes to Bangladesh's growing energy needs.";
    }

    if (lowerQuery.includes('notice') || lowerQuery.includes('announcement') || lowerQuery.includes('news')) {
        return "Stay updated with our latest announcements on the Notices page at /notices. We regularly post important updates about the project, corporate news, and public announcements.";
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey') || lowerQuery.includes('greet')) {
        return "Hello! Welcome to BIFPCL. I'm here to help you with information about our organization, the Maitree Power Project, tenders, careers, and more. What would you like to know?";
    }

    if (lowerQuery.includes('thank')) {
        return "You're welcome! If you have any more questions about BIFPCL or the Maitree Project, feel free to ask. I'm here to help!";
    }

    // Default response
    return "Thank you for your question. For specific inquiries, I recommend:\n\n• **Tenders:** Visit /tenders for procurement opportunities\n• **Careers:** Check /careers for job openings\n• **Notices:** See /notices for announcements\n• **Contact:** Reach us at /contact\n\nIs there something specific about BIFPCL or the Maitree Project I can help you with?";
};

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: content.trim(),
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay for more natural feel
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

        const response = getResponse(content);
        const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            content: response,
            role: 'assistant',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleQuickAction = (action: QuickAction) => {
        sendMessage(action.message);
    };

    const formatMessageContent = (content: string) => {
        // Convert **bold** to <strong>
        let formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
        // Convert newlines to <br>
        formatted = formatted.replace(/\n/g, '<br/>');
        // Convert bullet points
        formatted = formatted.replace(/• /g, '<span class="text-primary mr-1">•</span>');
        return formatted;
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    fixed bottom-6 right-6 z-50
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-primary to-primary-dark
                    text-white shadow-lg shadow-primary/30
                    hover:shadow-xl hover:shadow-primary/40 hover:scale-105
                    transition-all duration-300
                    flex items-center justify-center
                    ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                `}
                aria-label="Open chat"
            >
                <MessageCircle size={24} />
                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
            </button>

            {/* Chat Window */}
            <div
                className={`
                    fixed bottom-6 right-6 z-50
                    w-[380px] max-w-[calc(100vw-48px)]
                    bg-white dark:bg-secondary-dark
                    rounded-2xl shadow-2xl shadow-black/20
                    border border-gray-200 dark:border-white/10
                    flex flex-col
                    transition-all duration-300 origin-bottom-right
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                `}
                style={{ height: 'min(600px, calc(100vh - 100px))' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-primary to-primary-dark rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">BIFPCL Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-white/70 text-xs">Online</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                    ${message.role === 'assistant'
                                        ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                        : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                    }
                                `}
                            >
                                {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`
                                    max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                    ${message.role === 'assistant'
                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-tl-md'
                                        : 'bg-primary text-white rounded-tr-md'
                                    }
                                `}
                            >
                                {message.role === 'assistant' ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                                    />
                                ) : (
                                    message.content
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary">
                                <Bot size={16} />
                            </div>
                            <div className="bg-gray-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-tl-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <Sparkles size={12} className="text-primary" />
                            Quick Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => handleQuickAction(action)}
                                    className="
                                        inline-flex items-center gap-1.5 px-3 py-1.5
                                        bg-gray-100 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20
                                        text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light
                                        text-xs font-medium rounded-full
                                        border border-gray-200 dark:border-white/10 hover:border-primary/30
                                        transition-all duration-200
                                    "
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] rounded-b-2xl"
                >
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isTyping}
                            className="
                                flex-1 px-4 py-2.5
                                bg-white dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                rounded-xl text-sm
                                text-gray-900 dark:text-gray-200
                                placeholder-gray-400 dark:placeholder-gray-500
                                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                            "
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="
                                w-10 h-10 rounded-xl
                                bg-primary hover:bg-primary-dark
                                text-white
                                flex items-center justify-center
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                                hover:shadow-lg hover:shadow-primary/30
                            "
                        >
                            {isTyping ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                        Powered by BIFPCL AI Assistant
                    </p>
                </form>
            </div>
        </>
    );
}
