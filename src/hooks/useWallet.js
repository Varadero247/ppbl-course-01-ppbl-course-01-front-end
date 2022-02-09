import { useEffect, useState } from 'react';
import { useStoreState } from "easy-peasy";

import Cardano from '../cardano/serialization-lib';
import Wallet from '../cardano/wallet';

const useWallet = (initial = null) => {
  const connected = useStoreState((state) => state.connection.connected);
  const [wallet, setWallet] = useState(initial);

  useEffect(() => {
    if (connected && wallet === null) {
      getWallet();
    }
  }, [connected]);

  const getWallet = async () => {
    await Cardano.load();
    await Wallet.enable('nami');
    const walletAddress = (await Wallet.getUsedAddresses())[0];
    const walletUtxos = await Wallet.getUtxos();

    setWallet({
      address: walletAddress,
      utxos: walletUtxos,
    });
  };

  return { wallet };
};

export default useWallet;
