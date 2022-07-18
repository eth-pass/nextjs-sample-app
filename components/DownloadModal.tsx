import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import { useDownloadModalContext } from "../contexts/downloadModal";
import Image from "next/image";
import addAppleWallet from "../public/assets/apple-wallet-add.png";
import addGooglePay from "../public/assets/google-pay-add.png";
import QRCode from "qrcode";
import Modal from "./Modal";

export enum Platform {
  APPLE = "apple",
  GOOGLE = "google",
}

export default function DownloadModal() {
  const { hideModal, open, content } = useDownloadModalContext();
  const [qrCode, setQRCode] = useState(null);
  const { fileURL, platform } = content;

  useEffect(() => {
    if (!fileURL) return;
    QRCode.toDataURL(fileURL, {}, function (err, url) {
      if (err) throw err;
      setQRCode(url);
    });
  }, [fileURL]);

  return (
    <Modal isActive={open} onClose={hideModal}>
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 text-center sm:mt-5 flex flex-col justify-center align-center">
        <div className="mt-2 text-center">
          <p className="block text-sm font-medium text-gray-500 pointer-events-none">{`Scan QR code using your ${
            platform === Platform.GOOGLE ? "Android" : "Apple"
          } device`}</p>
          <div className="w-250 h-250 flex justify-center">
            <img src={qrCode} />
          </div>
          <p className="block text-sm font-medium text-gray-500 pointer-events-none mb-2">
            Or tap below to download directly on your mobile device.
          </p>
        </div>
        {platform && platform === Platform.APPLE ? (
          <a href={fileURL} download>
            <Image src={addAppleWallet} width={120} height={37} />
          </a>
        ) : (
          platform && (
            <a target="_blank" href={fileURL} rel="noreferrer">
              <Image src={addGooglePay} width={180} height={48} />
            </a>
          )
        )}
      </div>
    </Modal>
  );
}
