This project is a Next.js application developed to display interactive time series forecasting for the sales data of Bristol Myers Squibb. The primary dataset used for this analysis is INNOVIX_Floresland.xlsx.

First of all, we have made an intense preprocessing with Python in order to have all the data in one sheet, instead of having one variable per sheet. With this preprocessing, we have used a KNN in order to impute missing values. Then, three distinct models were explored to forecast the time series:

- Long Short-Term Memory (LSTM): A neural network-based approach suited for sequential data.
- Exponential Smoothing State Space Model (ETS): A robust statistical method for time series analysis.
- Autoregressive Integrated Moving Average (ARIMA): A widely-used statistical model for forecasting time-dependent data.

After evaluating the performance of these models, ARIMA emerged as the most accurate model. It was subsequently chosen for forecasting the sales data.

We also have made a webpage in Next.js in where we can upload our data and it will forecast it automatically by connecting to a Node.js backend. You can also change data interactively in the page, and arrange some parameters. It is visually attractive and simple. 

It is a user-friendly interface, designed to be visually attraactive and straightforward.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
