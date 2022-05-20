import type { NextApiRequest, NextApiResponse } from "next";

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
        if (platform === "apple") {
          pass = {
            description: "ETHPass Sample Pass",
            logoText: "ethpass.xyz",
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

        // Request to create pass
        const payload = await fetch(`https://api.ethpass.xyz/api/v0/passes`, {
          method: "POST",
          body: JSON.stringify({
            barcode: {
              message:
                "The contents of this message will be returned in the response payload after the pass has been scanned",
            },
            chainId,
            contractAddress,
            image,
            pass,
            platform,
            signature,
            signatureMessage,
            tokenId,
          }),
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": process.env.ETHPASS_API_KEY,
          }),
        });
        if (payload.status === 200) {
          const json = await payload.json();
          return res.status(200).json({ id: json.id, fileURL: json.fileURL });
        } else {
          const json = await payload.json();
          return res.status(payload.status).send(json.message);
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
