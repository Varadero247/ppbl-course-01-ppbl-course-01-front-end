#  Unsigs Marketplace Frontend

## Quick start

1. Grab this repo

    Use the Gatsby CLI to create a new site, specifying the minimal starter.

    ```shell
    git clone https://gitlab.com/gimbalabs/unsigs-frontend
    cd unsigs-frontend
    npm install
    npm run start
    ```
    Your site is now running at http://localhost:8000!

2. In order to really use the site, you'll see to get the backend running as well:

  - See https://github.com/ganeshnithyanandam/unsigs-be and follow the docs

3. Use with testnet or mainnet
  - in `/src/components/WalletButton/WalletButton.jsx`, look for
  
  ```
  if ((await window.cardano.getNetworkId()) === 0) return true;
  ```
  - If you're ready for mainnet, change the `0` to `1`

  - Also make sure to comment in/out the appropriate policy ID in `/src/pages/collection.js` (lines 27-31 or so)

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

