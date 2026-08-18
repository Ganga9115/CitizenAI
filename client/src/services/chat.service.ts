import { apiClient } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  authenticated: boolean;
  role: string;
}

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>(
    '/chat',
    {
      message,
      history,
    }
  );

  return response.data;
};