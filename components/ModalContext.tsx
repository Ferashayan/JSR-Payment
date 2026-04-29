'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ModalContextType = {
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

// Backwards-compatible alias
export function useModalLegacy() {
  const { openModal } = useContext(ModalContext);
  return { setActiveModal: openModal };
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = useCallback((id: string) => setActiveModal(id), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
