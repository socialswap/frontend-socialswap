import { useCallback, useRef } from 'react';

/**
 * useChatSounds — Plays high-quality professional MP3 notification sounds.
 * 
 *  playIncomingSound()     — Soft "pop/click" (user is in chat, message arrives)
 *  playNotificationSound() — Clean chime alert (message arrives, user not in chat)
 */
const useChatSounds = () => {
  const incomingAudioRef = useRef(null);
  const notificationAudioRef = useRef(null);

  // Created on first use so visitors who never get a message don't download them
  const getAudio = (ref, src, volume) => {
    if (!ref.current) {
      ref.current = new Audio(src);
      ref.current.volume = volume;
    }
    return ref.current;
  };

  const playIncomingSound = useCallback(() => {
    try {
      const audio = getAudio(incomingAudioRef, '/sounds/incoming.mp3', 0.15);
      audio.currentTime = 0; // Reset in case it's already playing
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Audio play prevented by browser:', err));
      }
    } catch (e) {
      console.error('Failed to play incoming sound', e);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = getAudio(notificationAudioRef, '/sounds/notification.mp3', 0.30);
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Audio play prevented by browser:', err));
      }
    } catch (e) {
      console.error('Failed to play notification sound', e);
    }
  }, []);

  return { playIncomingSound, playNotificationSound };
};

export default useChatSounds;
