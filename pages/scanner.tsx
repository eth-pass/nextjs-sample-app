import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { ellipsizeAddress } from "../helpers/format";
import { Fragment, useState, useEffect, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import LoadingIndicator from "../components/LoadingIndicator";
import QrScanner from "qr-scanner";

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

      const json = await response.json();
      console.log("## SCAN Result", json);
      setScanResult(json);
    } catch (err) {
      setScanResult({ valid: false });
      console.log("## ERROR", err);
    }
  };

  return (
    <>
      <div className="grid justify-center">
        <div className="text-center p-6">
          <h3 className="font-bold text-lg">Scanner</h3>
        </div>

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
        <Dialog as="div" className="relative z-10" onClose={reset}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6 w-full">
                  {scanResult ? (
                    <div>
                      <div>
                        {scanResult.valid ? (
                          <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                              <CheckIcon
                                className="h-6 w-6 text-green-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                              <Dialog.Title
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900"
                              >
                                Verified
                              </Dialog.Title>
                              <div className="mt-2 break-words">
                                <p className="text-sm text-gray-500">
                                  <strong>Contract Address: </strong>
                                  {ellipsizeAddress(scanResult.contractAddress)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <strong>Token ID: </strong>
                                  {scanResult.tokenId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <strong>Chain ID: </strong>
                                  {scanResult.chainId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <strong>Owner: </strong>
                                  {ellipsizeAddress(scanResult.ownerAddress)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <strong>Barcode Payload: </strong>
                                  {scanResult.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                              <XIcon
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                              <Dialog.Title
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900"
                              >
                                Invalid
                              </Dialog.Title>
                              <div className="mt-2"></div>
                            </div>
                          </div>
                        )}
                      </div>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
