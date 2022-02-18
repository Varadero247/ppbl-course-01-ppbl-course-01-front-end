#  Jukebox Demo v0

Forked from https://gitlab.com/gimbalabs/unsigs-frontend



### 1. Grab this repo
    ```shell
    git clone https://gitlab.com/gimbalabs/sandboxes/demo-v-0-front-end
    cd demo-v-0-front-end
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


## Submit a Pull Request

## This project is built with
1. [Gatsby JS](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
2. Chakra UI
3. A little bit of Framer Motion UI
4. Easy Peasy for local state management
5. Formik for `Offer` form

See `package.json` for full details.