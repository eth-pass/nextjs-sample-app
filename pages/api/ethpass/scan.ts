import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { data } = req.query;
      try {
        const result = await fetch(
          `${
            process.env.ETHPASS_API_HOST || "https://api.ethpass.xyz"
          }/api/v0/scan/?data=${data}`,
          {
            method: "GET",
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
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
