"use client";

import { Alert, AlertProps } from "@heroui/alert";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CustomAlertProps extends Omit<AlertProps, 'isVisible'> {
  message: React.ReactNode;
  autoClose?: boolean;
  duration?: number;
  showAlert?: boolean;
  onClose?: () => void;
}

export default function AlertComponent({
  message,
  title,
  color = "default",
  variant = "flat",
  radius = "md",
  isClosable = true,
  autoClose = false,
  duration = 5000,
  showAlert = true,
  icon,
  onClose,
  ...props
}: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(showAlert);

  // Reset visibility when the showAlert prop changes
  useEffect(() => {
    setIsVisible(showAlert);
  }, [showAlert]);

  // Handle auto-closing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoClose && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, isVisible, onClose]);

  const handleVisibilityChange = (visible: boolean) => {
    setIsVisible(visible);
    if (!visible && onClose) {
      onClose();
    }
  };

  // Enhanced styling for success alerts
  const getEnhancedStyles = () => {
    if (color === 'success') {
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderLeft: '4px solid rgb(34, 197, 94)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      };
    }
    return {};
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 9999 }}
          className="backdrop-blur-sm"
        >
          <Alert
            title={title}
            color={color}
            variant={variant}
            radius={radius}
            isClosable={isClosable}
            isVisible={true}
            icon={icon}
            onVisibleChange={handleVisibilityChange}
            style={getEnhancedStyles()}
            className={`${color === 'success' ? 'alert-success-enhanced shadow-lg' : ''}`}
            {...props}
          >
            {message}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}