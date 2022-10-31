import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      try {
        const result = await fetch(
          `${
            process.env.ETHPASS_API_HOST || "https://api.ethpass.xyz"
          }/api/v0/passes/${id}`,
          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              "x-api-key": process.env.ETHPASS_API_KEY,
            }),
          }
        );

        const distribution = await fetch(
          `${
            process.env.ETHPASS_API_HOST || "https://api.ethpass.xyz"
          }/api/v0/passes/${id}/distribute`,
          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              "x-api-key": process.env.ETHPASS_API_KEY,
            }),
          }
        );

        const json = await result.json();
        const { fileURL } = await distribution.json();

        if (result.status === 200) {
          return res.status(200).json({ ...json, fileURL });
        } else return res.status(result.status).json(json);
      } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
