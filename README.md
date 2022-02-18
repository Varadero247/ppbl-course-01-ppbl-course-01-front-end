# Plutus PBL Course 01
## Gimbalabs | February 2022

## How to use:

### 1. Grab this repo
    ```shell
    git clone https://gitlab.com/gimbalabs/ppbl/ppbl-course-01-front-end
    cd ppbl-course-01-front-end
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


## This project is built with
1. [Gatsby JS](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
2. Chakra UI
3. Easy Peasy for local state management

See `package.json` for full details.