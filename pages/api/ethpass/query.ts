import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const query = req.query as {
        ownerAddress: string;
        contractAddress: string;
        tokenId: string;
        network:string;
        chain: string;
        expired: string;
      }

      try {
        const response = await fetch(
          `${
            process.env.API_HOST || "https://api.ethpass.xyz"
          }/api/v0/passes?` + new URLSearchParams(query),
          {
            method: "GET",
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
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
