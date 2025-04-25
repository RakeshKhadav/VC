"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertComponent, { CustomAlertProps } from '../components/ui/AlertComponent';

// Custom icon components instead of relying on external libraries
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const InformationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

type AlertType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface AlertOptions extends Omit<CustomAlertProps, 'message' | 'color'> {
  id?: string;
}

interface NotificationContextProps {
  showAlert: (message: string, type?: AlertType, options?: AlertOptions) => string;
  hideAlert: (id: string) => void;
  clearAlerts: () => void;
}

interface Alert extends CustomAlertProps {
  id: string;
  color: AlertType;
}

// Default icons for different alert types
const alertIcons = {
  success: <CheckCircleIcon />,
  warning: <ExclamationTriangleIcon />,
  danger: <XCircleIcon />,
  default: <InformationCircleIcon />,
  primary: <InformationCircleIcon />,
  secondary: <InformationCircleIcon />
};

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  // Add a counter for stable ID generation
  const [idCounter, setIdCounter] = useState(0);

  const showAlert = (message: string, type: AlertType = 'default', options: AlertOptions = {}) => {
    // Use the provided ID or generate one using the counter
    const id = options.id || `alert-${idCounter}`;
    // Increment the counter for next alert
    setIdCounter(prev => prev + 1);
    
    // Set default values based on alert type
    const autoClose = options.autoClose ?? true; // Default all alerts to auto-close
    let duration = options.duration;
    let icon = options.icon;
    
    // Special handling for success alerts
    if (type === 'success') {
      duration = duration || 2000; // 2 seconds for success alerts
      icon = icon || alertIcons.success;
    } else {
      duration = duration || 5000; // 5 seconds for other alerts
      icon = icon || alertIcons[type] || alertIcons.default;
    }
    
    const newAlert: Alert = {
      id,
      message,
      color: type,
      autoClose,
      duration,
      icon,
      ...options
    };
    
    setAlerts(prev => [...prev, newAlert]);
    return id;
  };

  const hideAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <NotificationContext.Provider value={{ showAlert, hideAlert, clearAlerts }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
        {alerts.map((alert) => (
          <AlertComponent
            key={alert.id}
            message={alert.message}
            color={alert.color}
            variant={alert.variant || 'flat'}
            radius={alert.radius || 'md'}
            isClosable={alert.isClosable !== false}
            autoClose={alert.autoClose !== false}
            duration={alert.duration || 5000}
            onClose={() => hideAlert(alert.id)}
            title={alert.title}
            icon={alert.icon}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}