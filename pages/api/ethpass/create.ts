import type { NextApiRequest, NextApiResponse } from "next";
import { Platform } from "components/DownloadModal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const {
        chainId,
        contractAddress,
        image,
        platform,
        signature,
        signatureMessage,
        tokenId,
      } = req.body;
      try {
        // Customize Pass
        let pass;
        if (platform === Platform.APPLE) {
          pass = {
            description: "ETHPASS API DEMO",
            auxiliaryFields: [],
            backFields: [],
            headerFields: [],
            primaryFields: [],
            secondaryFields: [],
          };
        } else {
          pass = {
            messages: [],
          };
        }

        const body = {
          barcode: {
            message:
              "The contents of this message will be returned in the response payload after the pass has been scanned",
          },
          chain: {
            name: "evm",
            network: chainId,
          },
          nft: {
            contractAddress,
            tokenId,
          },
          image,
          pass,
          platform,
          signature,
          signatureMessage,
        };

        // Request to create pass
        const result = await fetch(
          `${
            process.env.ETHPASS_API_HOST || "https://api.ethpass.xyz"
          }/api/v0/passes`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
              "content-type": "application/json",
              "x-api-key": process.env.ETHPASS_API_KEY,
            }),
          }
        );
        const json = await result.json();
        return res.status(result.status).json(json);
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
