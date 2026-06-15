import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatBotIntrf, OpenRouterResponse } from "../models/chatbot.types";
import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import AuthServices from "./auth.service";
import DataModifier from "./data.service";

export default function ChatbotServices() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { currentUserId } = AuthServices();
    const { deleteData, insertData, infiniteScroll, message, setMessage } = DataModifier();
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const { error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd, paginatedData } = infiniteScroll<ChatBotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/all-chat-histories/${currentUserId}`,
        limit: 14,
        query_key: [`chat-histories-${currentUserId}`],
        stale_time: Infinity
    });

    const chatBotHistories = { error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd, paginatedData };

    const sanitizedAnswer = useMemo(() => {
        if (!answer) return '';
        return DOMPurify.sanitize(answer, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [answer]);

    const deleteAllChatMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => { 
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/remove-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete all chats');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteChatMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/remove/${id}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete chat');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false),
    });

    const sendQuestionMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            const request = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
                    "Content-Type": "application/json",
                    "X-Title": "My Note ChatBot"
                },
                body: JSON.stringify({
                    "model": "google/gemma-4-26b-a4b-it:free",
                    "messages": [{ 
                        "role": "user", 
                        "content": question.trim() 
                    }]
                })
            });

            const response: OpenRouterResponse = await request.json();

            if (response.choices && response.choices.length > 0) {
                const messageContent = response.choices[0].message.content;
                console.log("Received message content:", messageContent);

                if (typeof messageContent === 'string') {
                    setAnswer(messageContent);
                    await insertData<ChatBotIntrf>({
                        api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/send-question`, 
                        api_data: {
                            question: question.trim(),
                            answer: messageContent,
                            created_at: new Date().toISOString(),
                            user_id: currentUserId
                        }
                    });
                }
            }
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
            setQuestion('');
        },
        onSettled: () => setIsProcessing(false)
    });

    const sendQuestion = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        sendQuestionMt.mutate();
    }

    return { 
        answer, chatBotHistories, currentUserId, deleteAllChatMt, deleteChatMt, isProcessing, 
        message, navigate, question, sanitizedAnswer, sendQuestion, setAnswer, setMessage, setQuestion 
    }
}