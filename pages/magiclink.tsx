import { classNames } from "helpers/tailwind";
import { ConnectExtension } from "@magic-ext/connect";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { Platform } from "components/DownloadModal";
import { useDownloadModalContext } from "contexts/downloadModal";
import { useEffect, useState } from "react";
import Head from "next/head";
import toast from "react-hot-toast";

const requiredParams = {
  contractAddress: "",
  tokenId: "",
  image: "",
  chainId: "",
  platform: Platform.APPLE,
};

export default function MagicLink() {
  const [address, setAddress] = useState("");
  const [magic, setMagic] = useState(null);
  const [toggle, setToggle] = useState(null);

  const [pending, setPending] = useState<boolean>(false);
  const [postResult, setPostResult] = useState<any>({});
  const [getResult, setGetResult] = useState<any>({});
  const { showModal: showDownloadModal, open } = useDownloadModalContext();

  const [formData, setFormData] = useState(requiredParams);

  useEffect(() => {
    setMagic(
      new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
        network: "mainnet",
        locale: "en_US",
        extensions: [new ConnectExtension()],
      } as any)
    );
  }, []);

  useEffect(() => {
    if (!magic) return;

    const checkIsLoggedIn = async () => {
      try {
        const walletInfo = await magic.connect.getWalletInfo();
        const walletType = walletInfo.walletType;

        return walletType;
      } catch (error) {
        setAddress(null);
        console.log(error);
      }
    };

    checkIsLoggedIn();
  }, [magic, toggle]);

  const login = async () => {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    provider
      .listAccounts()
      .then((accounts) => setAddress(accounts?.[0]))
      .catch((error) => console.log(error));
  };

  const showWallet = async () => {
    const walletInfo = await magic.connect.getWalletInfo();
    const walletType = walletInfo.walletType;
    if (walletType === "magic") {
      magic.connect.showWallet().catch((error) => console.log(error));
    } else {
      disconnect();
    }
    setToggle(!toggle);
  };

  const disconnect = async () => {
    await magic.connect.disconnect().catch((error) => {
      toast.error(error.rawMessage);
      console.log(error);
    });
    setAddress(null);
  };

  const reset = () => {
    setPostResult(null);
    setGetResult(null);
    setFormData(requiredParams);
  };

  // Call made to create genesis wallet pass
  const createPass = async () => {
    const signatureToast = toast.loading("Waiting for signature...");
    const signatureMessage = `Sign this message to generate a test pass with ethpass.xyz\n${Date.now()}`;

    let signature;
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    try {
      signature = await signer.signMessage(signatureMessage);
    } catch (error) {
      console.log(error);
      return;
    } finally {
      toast.dismiss(signatureToast);
    }

    const payload = {
      ...formData,
      signature,
      signatureMessage,
      barcode: {
        message: "Payload returned after successfully scanning a pass",
      },
    };
    setPending(true);
    const pendingToast = toast.loading("Generating pass...");
    try {
      const response = await fetch("/api/ethpass/create", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({
          "content-type": "application/json",
        }),
      });
      toast.dismiss(pendingToast);
      if (response.status === 200) {
        const json = await response.json();
        setPending(false);
        setPostResult(json);

        console.log("## POST Result", json);
        showDownloadModal({
          fileURL: json.fileURL,
          platform: payload.platform,
        });
      } else if (response.status === 401) {
        toast.error(`Unable to verify ownership: ${response.statusText}`);
      } else {
        try {
          const { error, message } = await response.json();
          toast.error(error || message);
        } catch {
          toast.error(`${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      console.log("## POST ERROR", err);
      toast.error(err.message);
    } finally {
      setPending(false);
      toast.dismiss(signatureToast);
    }
  };

  const apiCall = async (url: string, method: string) => {
    setPending(true);
    const loading = toast.loading("Making request...");
    try {
      const response = await fetch(url, {
        method,
        headers: new Headers({
          "content-type": "application/json",
        }),
      });

      toast.dismiss(loading);
      const json = await response.json();
      toast.success("Check console logs");
      console.log(`## ${method} - ${url} Response: `, json);
      return json;
    } catch (err) {
      console.log(`## ${method} - ${url} Error: `, err);
      toast.error("Check console logs");
    } finally {
      setPending(false);
    }
  };

  // Call made to fetch pass information and/or offer the user the option to download the pass again

  // Call made to verify pass and return the metadata encoded in the barcode.
  // This call will generally be made from the device that scans the passes.

  const renderForm = () => {
    const validInput =
      formData.contractAddress && formData.tokenId && formData.chainId;

    return (
      <div className="max-w-3xl mx-auto py-12">
        <label
          htmlFor="contract"
          className="block text-sm font-medium text-gray-700"
        >
          <span className="text-red-500">* </span>Contract Address
        </label>
        <div className="mt-1 mb-6">
          <input
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
            type="text"
            minLength={42}
            maxLength={42}
            value={formData.contractAddress}
            onChange={(e) =>
              setFormData({ ...formData, contractAddress: e.target.value })
            }
          />
        </div>
        <label
          htmlFor="tokenId"
          className="block text-sm font-medium text-gray-700"
        >
          <span className="text-red-500">* </span>Token ID
        </label>
        <div className="mt-1 mb-6">
          <input
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
            type="number"
            value={formData.tokenId}
            onChange={(e) =>
              setFormData({ ...formData, tokenId: e.target.value })
            }
          />
        </div>
        <label
          htmlFor="network"
          className="block text-sm font-medium text-gray-700"
        >
          <span className="text-red-500">* </span> Chain ID
        </label>
        <div className="mt-1 mb-6">
          <input
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            type="number"
            value={formData.chainId}
            onChange={(e) =>
              setFormData({ ...formData, chainId: e.target.value })
            }
          />
        </div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Thumbnail Image URL <small>(PNG, JPG up to 500KB)</small>
        </label>
        <div className="mt-1 mb-6">
          <input
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue="Apple"
            onChange={(e) =>
              // @ts-ignore
              setFormData({ ...formData, platform: e.target.value })
            }
          >
            <option value={Platform.APPLE}>Apple</option>
            <option value={Platform.GOOGLE}>Google</option>
          </select>
        </div>
        <button
          className={classNames(
            "inline-flex items-center px-6 py-2 my-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white",
            !validInput
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
          onClick={() => validInput && createPass()}
        >
          Generate Pass
        </button>
      </div>
    );
  };

  const renderSinglePassActions = () => {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pass: {postResult.id}
          </h3>
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm text-gray-500">
              <p>
                Pass successfully created! Use the unique identifier above to
                make further API requests for this pass.
              </p>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:shrink-0 sm:flex sm:items-center flex-col">
              <button
                onClick={async () => {
                  if (pending) return;
                  const response = await apiCall(
                    `/api/ethpass/get?id=${postResult.id}`,
                    "GET"
                  );
                  setGetResult(response);
                  showDownloadModal({
                    fileURL: response.fileURL,
                    platform: response.platform,
                  });
                }}
                type="button"
                className="mb-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>ethpass | Magic Link Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex items-center justify-center my-8">
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition duration-300 ease-in-out hover:bg-indigo-500"
            onClick={!address ? login : showWallet}
          >
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Sign In With Magic Link"}
          </button>
        </div>
        {address ? (
          <div>
            <div>
              {postResult?.id ? renderSinglePassActions() : renderForm()}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
