import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { data } = req.query;
      try {
        const payload = await fetch(
          `${
            process.env.API_HOST || "https://api.ethpass.xyz"
          }/api/v0/scan/?data=${data}`,
          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              "x-api-key": process.env.ETHPASS_API_KEY,
            }),
          }
        );

        if (payload.status === 200) {
          const json = await payload.json();
          return res.status(200).json(json);
        } else {
          const json = await payload.json();
          return res.status(payload.status).send(json.message);
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
