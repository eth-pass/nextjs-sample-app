import React, { createContext, useContext, useState } from "react";
import DownloadModal, { Platform } from "../components/DownloadModal";

const DownloadModalContext = createContext({
  open: false,
  content: { fileURL: null, platform: null },
  showModal: ({ fileURL, platform }) => {},
  hideModal: () => {},
});

export const useDownloadModalContext = () => {
  return useContext(DownloadModalContext);
};

const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<{
    fileURL: string;
    platform: Platform;
  } | null>({
    fileURL: null,
    platform: null,
  });

  const showModal = ({ fileURL, platform }) => {
    setContent({ fileURL, platform });
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
    setTimeout(() => setContent({ fileURL: null, platform: null }), 500);
  };

  return (
    <DownloadModalContext.Provider
      value={{ open, showModal, hideModal, content }}
    >
      {children}
      <DownloadModal />
    </DownloadModalContext.Provider>
  );
};

export { ModalProvider as DownloadModalProvider };
