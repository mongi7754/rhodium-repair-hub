import { useState, useEffect } from "react";

const PIN_SESSION_KEY = "pin_verified_at";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const usePinVerification = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifiedAt = sessionStorage.getItem(PIN_SESSION_KEY);
    if (verifiedAt && Date.now() - Number(verifiedAt) < SESSION_DURATION_MS) {
      setIsVerified(true);
    }
  }, []);

  const verify = () => {
    sessionStorage.setItem(PIN_SESSION_KEY, String(Date.now()));
    setIsVerified(true);
  };

  const revoke = () => {
    sessionStorage.removeItem(PIN_SESSION_KEY);
    setIsVerified(false);
  };

  return { isVerified, verify, revoke };
};
