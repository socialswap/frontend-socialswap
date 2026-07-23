import { useCallback, useRef, useEffect } from 'react';

/**
 * useChatSounds — Plays high-quality professional MP3 notification sounds.
 * 
 *  playIncomingSound()     — Soft "pop/click" (user is in chat, message arrives)
 *  playNotificationSound() — Clean chime alert (message arrives, user not in chat)
 */
const useChatSounds = () => {
  const incomingAudioRef = useRef(null);
  const notificationAudioRef = useRef(null);

  // Preload the audio files on mount
  useEffect(() => {
    incomingAudioRef.current = new Audio('/sounds/incoming.mp3');
    notificationAudioRef.current = new Audio('/sounds/notification.mp3');
    
    // Lowered volume drastically to make them extremely soft and comfortable
    incomingAudioRef.current.volume = 0.15;
    notificationAudioRef.current.volume = 0.30;
  }, []);

  const playIncomingSound = useCallback(() => {
    try {
      if (incomingAudioRef.current) {
        incomingAudioRef.current.currentTime = 0; // Reset in case it's already playing
        const playPromise = incomingAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.log('Audio play prevented by browser:', err));
        }
      }
    } catch (e) {
      console.error('Failed to play incoming sound', e);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      if (notificationAudioRef.current) {
        notificationAudioRef.current.currentTime = 0;
        const playPromise = notificationAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.log('Audio play prevented by browser:', err));
        }
      }
    } catch (e) {
      console.error('Failed to play notification sound', e);
    }
  }, []);

  return { playIncomingSound, playNotificationSound };
};

export default useChatSounds;
