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
        const response = await fetch(
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
        if (response.status === 200) {
          const json = await response.json();
          return res.status(200).json(json);
        } else {
          const json = await response.json();
          return res.status(response.status).send(json.message);
        }
      } catch (err) {
        return res.status(400).send(err.message);
      }

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
