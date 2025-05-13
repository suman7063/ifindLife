
import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  id?: string;
  [key: string]: any;
};

export function toast(props: ToastProps | string) {
  if (typeof props === "string") {
    return sonnerToast(props);
  }

  const { title, description, action, ...restProps } = props;
  return sonnerToast(title || "", {
    description,
    action,
    ...restProps,
  });
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const updateToast = useCallback((id: string, props: ToastProps) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...props } : t))
    );
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast: addToast,
    update: updateToast,
    dismiss: dismissToast,
    toasts,
  };
}
