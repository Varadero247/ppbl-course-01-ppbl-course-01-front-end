#  Unsigs Marketplace Development

## Project Repositories
- Plutus: https://gitlab.com/gimbalabs/ppbl/unsigs-market-plutus/
- Backend: https://github.com/ganeshnithyanandam/unsigs-be
- Frontend: this repo

## Contributing to the Marketplace Front-End
- Call to action: Unsigs DAO --> development of the `/about` page

## Development Process
- `unsigned_DAO` will develop a process for prioritizing development goals

# Additional Repos
- unsigs-market-plutus https://gitlab.com/gimbalabs/ppbl/unsigs-market-plutus
- backend: https://github.com/ganeshnithyanandam/unsigs-be

# Contributing to this front-end repository

## Run locally:

### 1. Grab this repo
    ```shell
    git clone https://gitlab.com/gimbalabs/unsigs-frontend
    cd unsigs-frontend
    npm install
    npm run start
    ```
    Your site is now running at http://localhost:8000!

### 2. Use with Cardano `testnet` or `mainnet`
#### in `/src/components/WalletButton/WalletButton.jsx`, look for
```
if ((await window.cardano.getNetworkId()) === 0) return true;
```
- Testnet -> `0` | Mainnet -> `1`

#### In `/cardano/market-contract/index.js`
- Comment in/out `unsigPolicyId`, `artistAddress`, and `daoAddress`



## Submit a Pull Request

## This project is built with
1. [Gatsby JS](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
2. Chakra UI
3. A little bit of Framer Motion UI
4. Easy Peasy for local state management
5. Formik for `Offer` form

See `package.json` for full details.


## Next Steps -> Issues
1. Monitoring solutions for DB / On-Chain Contract
2. Catapult / serverless / distributed solution?
3. Replace Blockfrost with Dandelion in unsigs-be --> possibly add submit API to backend
4. Refactor unsigs-be so that it updates `/offers` when a successful TX hits the contract address