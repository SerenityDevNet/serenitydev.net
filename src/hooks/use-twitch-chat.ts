"use client";
import { useEffect, useState } from 'react';
import tmi from 'tmi.js';

export interface ChatMessage {
  id: string;
  user: string;
  color: string;
  text: string;
  isBroadcaster: boolean;
  isMod: boolean;
}

export function useTwitchChat(channel: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // 1. Setup Client
    const client = new tmi.Client({
      channels: [channel],
      connection: { secure: true, reconnect: true },
    });

    client.connect().catch((err) => {
        console.error("Twitch Chat Connection Failed:", err);
    });

    // 2. Listen for Messages
    client.on('message', (channel, tags, message, self) => {
      if (self) return;

      const newMessage: ChatMessage = {
        id: tags.id || Math.random().toString(),
        user: tags['display-name'] || tags.username || 'Anonymous',
        color: tags.color || '#f59e0b', // Default to Lobotomy Amber if no color
        text: message,
        isBroadcaster: tags.badges?.broadcaster === '1',
        isMod: tags.mod || false,
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        if (updated.length > 50) updated.shift(); // Keep history manageable
        return updated;
      });
    });

    return () => {
      client.disconnect();
    };
  }, [channel]);

  return messages;
}