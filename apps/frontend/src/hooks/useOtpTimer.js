// src/hooks/useOtpTimer.js
// Manages the 5-minute OTP countdown and resend cooldown.

import { useCallback, useEffect, useRef, useState } from 'react';
import { requestOtp } from '../services/auth.service.js';

const OTP_EXPIRY_SECONDS = 5 * 60; // must match backend OTP_EXPIRY_MINUTES

/**
 * @param {string} identifier  - email or phone for resend
 * @returns {{
 *   secondsLeft:  number,
 *   isExpired:    boolean,
 *   isResending:  boolean,
 *   resendError:  string|null,
 *   handleResend: () => Promise<void>,
 *   resetTimer:   () => void,
 * }}
 */
export function useOtpTimer(identifier) {
  const [secondsLeft,  setSecondsLeft]  = useState(OTP_EXPIRY_SECONDS);
  const [isResending,  setIsResending]  = useState(false);
  const [resendError,  setResendError]  = useState(null);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setSecondsLeft(OTP_EXPIRY_SECONDS);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  // Start on mount
  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  const resetTimer = useCallback(() => startTimer(), [startTimer]);

  const handleResend = useCallback(async () => {
    if (isResending || secondsLeft > 0) return;
    setIsResending(true);
    setResendError(null);
    try {
      await requestOtp({ identifier });
      resetTimer();
    } catch (err) {
      setResendError(err.message);
    } finally {
      setIsResending(false);
    }
  }, [identifier, isResending, secondsLeft, resetTimer]);

  /* Format mm:ss */
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return {
    timeLabel:   `${minutes}:${seconds}`,
    secondsLeft,
    isExpired:   secondsLeft === 0,
    isResending,
    resendError,
    handleResend,
    resetTimer,
  };
}
