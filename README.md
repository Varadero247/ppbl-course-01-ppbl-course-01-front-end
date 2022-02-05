#  Unsigs Marketplace Development

## Contributing to the Marketplace Front-End
- Call to action: Unsigs DAO --> development of the `/about` page
- We can schedule a live hand-off meeting

## Development Process
- There is a lot of further functionality that we'd all like to see in this project. It's up to the `unsigned_DAO` to develop a process for prioritizing these goals and funding the work so that it gets done.

# Contributing to this front-end repository

## Run locally:

1. Grab this repo
    ```shell
    git clone https://gitlab.com/gimbalabs/unsigs-frontend
    cd unsigs-frontend
    npm install
    npm run start
    ```
    Your site is now running at http://localhost:8000!

2. Use with testnet or mainnet -- can we leave this as an option?
  - Will need to toggle both back-end and Cardano
  - in `/src/components/WalletButton/WalletButton.jsx`, look for

  ```
  if ((await window.cardano.getNetworkId()) === 0) return true;
  ```
  - If you're ready for mainnet, change the `0` to `1`

  - Also make sure to comment in/out the appropriate policy ID in `/src/pages/collection.js` (lines 27-31 or so)

## Submit a Pull Request


## This project is built with
1. [Gatsby JS](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
2. Chakra UI
3. A little bit of Framer Motion UI

See `package.json` for more details: Formik, Easy Peasy etc.