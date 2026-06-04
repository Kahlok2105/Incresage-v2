import { useCallback, useState } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'death';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  createdAt: number;
}

const AUTO_DISMISS_MS = 5000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'info') => {
      const id = crypto.randomUUID();
      const notification: Notification = {
        id,
        message,
        type,
        createdAt: Date.now(),
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 10));

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, AUTO_DISMISS_MS);

      return id;
    },
    [],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
}