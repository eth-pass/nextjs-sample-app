import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { Fragment, useState, useEffect, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import QrScanner from "qr-scanner";
import moment from "moment";
import Image from "next/image";
import { ellipsizeAddress } from "../helpers/format";
import LoadingIndicator from "../components/LoadingIndicator";

export default function Scanner(props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [scanResult, setScanResult] = useState(null);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }
    const qrScanner = new QrScanner(
      videoElement,
      async (result) => {
        qrScanner.stop();
        await scanPass(result.data);
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
      }
    );
    scannerRef.current = qrScanner;
    if (!scanResult) {
      qrScanner.start().catch((error) => console.error(error));
    }
    return () => qrScanner.stop();
  }, [scanResult]);

  const stop = () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }
    scanner.stop();
  };

  const start = () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }
    scanner.start();
  };

  const reset = () => {
    setPending(false);
    setTimeout(() => {
      setScanResult(null);
    }, 300); // Transition animation duration
  };

  const scanPass = async (data?: string) => {
    setPending(true);
    try {
      const response = await fetch(`/api/ethpass/scan?data=${data}`, {
        headers: new Headers({
          "content-type": "application/json",
        }),
      });

      if (response.status === 200) {
        const json = await response.json();
        setScanResult({ success: true, ...json });
      } else {
        setScanResult({ success: false });
      }
    } catch (err) {
      setScanResult({ success: false });
      console.log("## ERROR", err);
    }
  };

  const renderNFTDetails = () => {
    const nft = scanResult.nfts[0];
    return (
      <>
        <h3 className="mt-4 text-xl tracking-tight font-extrabold text-gray-900">
          NFT Details
        </h3>
        {nft?.contractAddress ? (
          <p className="mb-2 text-sm text-gray-500">
            {" "}
            <strong>Contract Address: </strong>
            {ellipsizeAddress(nft?.contractAddress)}
          </p>
        ) : null}
        {nft?.tokenId ? (
          <p className="mb-2 text-sm text-gray-500">
            {" "}
            <strong>Token ID: </strong>
            {nft?.tokenId}
          </p>
        ) : null}
        <p className="mb-2 text-sm text-gray-500">
          <strong>Network ID: </strong> {scanResult?.chain?.network}
        </p>
        <p className="mb-2 text-sm text-gray-500">
          <strong>Ownership Status: </strong> {nft?.valid ? "Valid" : "Invalid"}
        </p>
      </>
    );
  };

  const renderPassMetadata = () => {
    if (!scanResult) return;
    return (
      <div className="mt-2 text-justify">
        <p className="mb-2 text-sm text-gray-500">
          <strong>Owner: </strong>
          {ellipsizeAddress(scanResult?.ownerAddress)}
        </p>

        {scanResult?.chain?.name ? (
          <p className="mb-2 text-sm text-gray-500">
            {" "}
            <strong>Chain: </strong>
            {scanResult?.chain?.name.toUpperCase()}
          </p>
        ) : null}
        {scanResult?.lastScannedAt && (
          <p className="mb-2 text-sm text-gray-500">
            <strong>Last scanned:</strong>{" "}
            {new Date(scanResult?.lastScannedAt).toLocaleString()}
          </p>
        )}
        {scanResult?.expiredAt && (
          <p className="mb-2 text-sm text-gray-500">
            <strong>Pass Expired:</strong>{" "}
            {new Date(scanResult?.expiredAt).toLocaleString()}
          </p>
        )}
        {scanResult?.nfts?.length ? <>{renderNFTDetails()}</> : null}
      </div>
    );
  };

  const renderIcon = () => {
    if (!scanResult) return;
    if (!scanResult?.success || scanResult.expiredAt) {
      return (
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Pass Invalid
            </Dialog.Title>
            <div className="mt-2"></div>
          </div>
        </div>
      );
    }
    if (scanResult.lastScannedAt) {
      return (
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <CheckIcon className="h-6 w-6 text-yellow-700" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Valid Pass
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-4">
                {`This pass is valid however, it was scanned ${moment(
                  scanResult?.lastScannedAt
                ).fromNow()}.`}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Valid Pass
            </Dialog.Title>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="grid justify-center">
        <video
          ref={videoRef}
          className="rounded-xl object-cover w-full max-w-sm h-96 mb-8"
          muted
          id="scanner"
        />

        <div className="flex flex-col align-center justify-center items-center">
          <button
            onClick={start}
            type="button"
            className="mb-4 inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            START
          </button>
          <button
            onClick={stop}
            type="button"
            className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            STOP
          </button>
        </div>
      </div>

      <Transition.Root show={pending} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={reset}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-lg w-full sm:p-6">
                <div>{renderIcon()}</div>
                {scanResult?.success ? <div>{renderPassMetadata()}</div> : null}
                {scanResult ? (
                  <div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        onClick={reset}
                      >
                        Scan another pass
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <LoadingIndicator />
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Verifying...
                        </Dialog.Title>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
