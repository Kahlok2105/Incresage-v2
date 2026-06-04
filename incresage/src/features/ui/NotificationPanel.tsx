import type { Notification } from '../../hooks/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  onDismiss,
}: NotificationPanelProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-panel">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
          onClick={() => onDismiss(notification.id)}
        >
          <span className="notification__message">{notification.message}</span>
          <button
            type="button"
            className="notification__dismiss"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}