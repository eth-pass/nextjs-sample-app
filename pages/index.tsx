import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSigner } from "wagmi";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const { data } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const [pending, setPending] = useState<boolean>(false);
  const [postResult, setPostResult] = useState<any>({});
  const [getResult, setGetResult] = useState<any>({});
  const [scanResult, setScanResult] = useState<any>({});

  const [qrCode, setQRCode] = useState(null);

  const isActive = !!data?.address;

  useEffect(() => {
    if (!isActive) {
      reset();
    }
  }, [isActive]);

  const reset = () => {
    setPostResult(null);
    setGetResult(null);
    setScanResult(null);
    setQRCode(null);
  };

  // Call made to create genesis wallet pass
  const createPass = async () => {
    const signatureMessage = `Sign this message to generate a test pass with ethpass.xyz\n${Date.now()}`;
    const signature = await signer.signMessage(signatureMessage);
    const payload = {
      signature,
      signatureMessage,
      contractAddress: "",
      tokenId: "",
      chainId: "",
      platform: "apple", // 'apple' or 'google'
      image: "", // Optional thumbnail image URL to be displayed on pass.
    };
    setPending(true);
    try {
      const response = await fetch("/api/ethpass/create", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({
          "content-type": "application/json",
        }),
      });

      const json = await response.json();
      setPostResult(json);
      console.log("## POST Result", json);
      QRCode.toDataURL(json.fileURL, {}, function (err, url) {
        if (err) throw err;
        setQRCode(url);
      });
    } catch (err) {
      console.log("## ERROR", err);
    } finally {
      setPending(false);
    }
  };

  // Call made to fetch pass information and/or offer the user the option to download the pass again
  const getPass = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/ethpass/get?id=${postResult.id}`, {
        headers: new Headers({
          "content-type": "application/json",
        }),
      });

      const json = await response.json();
      console.log("## GET Result", json);
      setGetResult(json);
    } catch (err) {
      console.log("## ERROR", err);
    } finally {
      setPending(false);
    }
  };

  // Call made to verify pass and return the metadata encoded in the barcode.
  // This call will generally be made from the device that scans the passes.
  const scanPass = async () => {
    setPending(true);

    try {
      const response = await fetch(
        `/api/ethpass/scan?data=${getResult.barcodeSignature}`,
        {
          headers: new Headers({
            "content-type": "application/json",
          }),
        }
      );

      const json = await response.json();
      console.log("## SCAN Result", json);
      setScanResult(json);
    } catch (err) {
      console.log("## ERROR", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ETHPass API Implementation Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        {isActive ? (
          <div className={styles.grid}>
            <div className={styles.card}>
              <button
                style={{ width: 200 }}
                onClick={() => !pending && createPass()}
              >
                Create Pass
              </button>

              {qrCode ? (
                <>
                  <div>
                    <img src={qrCode} />
                  </div>
                  <small>
                    <strong>Scan QR code to download wallet pass</strong>
                  </small>
                  <small>Pass ID: {postResult.id}</small>
                </>
              ) : null}
            </div>
            {postResult?.id ? (
              <div className={styles.card}>
                <button
                  style={{ width: 200 }}
                  onClick={() => !pending && getPass()}
                >
                  Get Pass
                </button>
                {getResult?.barcodeSignature
                  ? Object.keys(getResult).map((key) => {
                      return (
                        <small key={key}>
                          <strong>{key}:</strong> {String(getResult[key])}
                        </small>
                      );
                    })
                  : null}
              </div>
            ) : null}
            {getResult?.barcodeSignature ? (
              <div className={styles.card}>
                <button
                  style={{ width: 200 }}
                  onClick={() => !pending && scanPass()}
                >
                  Scan Barcode
                </button>
                {scanResult?.message
                  ? Object.keys(scanResult).map((key) => {
                      return (
                        <small key={key}>
                          <strong>{key}:</strong> {String(scanResult[key])}
                        </small>
                      );
                    })
                  : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {postResult?.id ? (
          <a
            style={{
              color: "red",
              fontWeight: "bold",
            }}
            href="#"
            onClick={reset}
          >
            RESET
          </a>
        ) : null}
      </main>
    </div>
  );
}
