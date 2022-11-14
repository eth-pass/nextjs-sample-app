This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), [`rainbow-kit`](https://github.com/rainbow-me/rainbowkit) and [`tailwind-css`](https://tailwindcss.com/)

## Getting Started

First, create a file named `.env.local` in the root directory and add your API key

```
ETHPASS_API_KEY="YOUR_API_KEY"
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/ethpass](http://localhost:3000/api/ethpass).

## Examples

### Creating a pass

This example contains everything you need to create your first pass.

Fill out the form with the details of the NFT in the wallet you want to create a pass for. Manually inputting the required parameters is for demo purposes only. You'll likely replace this with data aggregated from your integration. E.g. (OpenSea, Alchemy, Zora)

![create](https://user-images.githubusercontent.com/3741055/180839388-13ff2ce1-4e93-40d8-a63f-59e191c2aecf.gif)

### Scanning a pass

Scan passes to verify ownership and view the data you encoded in the barcode.

![scan](https://user-images.githubusercontent.com/3741055/180848044-41bb75de-1654-49c1-8ae1-dbd7a9790c88.gif)

## Documentation

For full API documentation, visit [docs.ethpass.xyz](https://docs.ethpass.xyz).

## Linting
The app has some eslint plugins installed for typescript, react, nextjs, and tailwind. Run `yarn lint --fix` to lint your code. 

## Troubleshooting

#### Camera not working on mobile devices
- Make sure the web server has valid SSL certificates and is available with `https://`

#### 429 alchemy-api errors / rate limiting errors
- The app leverages wagmi's free RPC provider (see `pages/_app.tsx`). This provider is subject to rate limiting and is not 100% reliable, especially for production.
- If your use case requires a reliable provider, please reference wagmi's [documentation](https://wagmi.sh/docs/providers/public) to configure your own provider with alchemy / infura / etc.