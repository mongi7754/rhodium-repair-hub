import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        } 
      });
      
      // Try supported mime types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      // Use timeslice to capture data every 250ms
      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      toast({
        title: "Recording started 🎙️",
        description: "Speak clearly — tap again to stop",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access in your browser settings",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      setIsProcessing(true);

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        
        if (audioBlob.size < 1000) {
          toast({
            title: "No audio captured",
            description: "Please try again and speak louder",
            variant: "destructive",
          });
          setIsProcessing(false);
          resolve(null);
          return;
        }

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) {
            toast({
              title: "Error",
              description: "Failed to process audio",
              variant: "destructive",
            });
            setIsProcessing(false);
            resolve(null);
            return;
          }

          try {
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audio: base64Audio },
            });

            if (error) throw error;

            if (data?.text) {
              toast({
                title: "Voice recognized ✅",
                description: data.text.substring(0, 60) + "...",
              });
              setIsProcessing(false);
              resolve(data.text);
            } else {
              throw new Error('No text returned from transcription');
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            toast({
              title: "Transcription failed",
              description: "Please try again or type manually",
              variant: "destructive",
            });
            setIsProcessing(false);
            resolve(null);
          }
        };
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    });
  }, [toast]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};
