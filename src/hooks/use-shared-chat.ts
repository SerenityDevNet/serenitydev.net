"use client";
import { useEffect, useState } from 'react';
import tmi from 'tmi.js';

// The Squad
const CHANNELS = [
  'serenity_dev',
  'ilaiyayaya',
  'familyneighbor'
];

export interface SharedChatMessage {
  id: string;
  user: string;
  color: string;
  text: string;
  sourceChannel: string; // <--- The new key that tells us where it came from
  isBroadcaster: boolean;
  isMod: boolean;
}

export function useSharedChat() {
  const [messages, setMessages] = useState<SharedChatMessage[]>([]);

  useEffect(() => {
    const client = new tmi.Client({
      channels: CHANNELS,
      connection: { secure: true, reconnect: true },
    });

    client.connect().catch(console.error);

    client.on('message', (channel, tags, message, self) => {
      if (self) return;

      // TMI returns channel as "#serenity_dev", we want just "serenity_dev"
      const cleanChannel = channel.replace('#', '');

      const newMessage: SharedChatMessage = {
        id: tags.id || Math.random().toString(),
        user: tags['display-name'] || tags.username || 'Anonymous',
        color: tags.color || '#a855f7', // Default purple if no color set
        text: message,
        sourceChannel: cleanChannel, // Tag the origin
        isBroadcaster: tags.badges?.broadcaster === '1',
        isMod: tags.mod || false,
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        if (updated.length > 50) updated.shift();
        return updated;
      });
    });

    return () => {
      client.disconnect();
    };
  }, []);

  return messages;
}