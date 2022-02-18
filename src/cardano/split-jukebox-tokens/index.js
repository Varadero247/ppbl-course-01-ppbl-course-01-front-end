import Cardano from '../serialization-lib'
import {
    assetsToValue,
    createTxOutput,
    finalizeTx,
    initializeTx,
  } from "../transaction";
  import { fromHex } from "../../utils/converter";

// split-jukebox-tokens

export const splitJukeboxTokens = async ({ address, utxosParam }) => {
    try {
        const { txBuilder, outputs } = initializeTx();
        const utxos = utxosParam.map((utxo) =>
            Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
        );

        const recordLabel = "addr_test1qrcxwfmfruyrjzzdz2ryjck8rete5qwslf4r5506f02asc4te2hpevlhe93slj725xny5vq6cv2k3n30hy8upa3v9xkq8r8zk4"
        const musician = "addr_test1qz9kpprndluj7r9g504z4nlulnfzzn6hzg8qm50mdnexc2ytgp2r0v8s3ut74p6u2m3c8tg0wngn9sl3v3ffs0knuk5qssjj76"
        const jukebox = "addr_test1qznep0cdkjfyrer9t6kgtcpzs3p9zthe7xrxzz5cd593vm5cvm8ya80rpc6vecrfgjj9z0l03dtduv73nlalhesnkasq7pjwr7"
        const requiredLovelace = 2000000
        const recordLabelTake = 5
        const musicianTake = 4
        const jukeboxTake = 1

        outputs.add(
            createTxOutput(
                Cardano.Instance.Address.from_bech32(recordLabel),
                assetsToValue([{ unit: "lovelace", quantity: `${requiredLovelace}`}, { unit: "44d5cc3395e94e805a24085cf275647b32c9aa7839e4d6bb4fe10f05744a", quantity: `${recordLabelTake}`}])
            )
        );

        outputs.add(
            createTxOutput(
                Cardano.Instance.Address.from_bech32(musician),
                assetsToValue([{ unit: "lovelace", quantity: `${requiredLovelace}`}, { unit: "44d5cc3395e94e805a24085cf275647b32c9aa7839e4d6bb4fe10f05744a", quantity: `${musicianTake}`}])
            )
        );

        outputs.add(
            createTxOutput(
                Cardano.Instance.Address.from_bech32(jukebox),
                assetsToValue([{ unit: "lovelace", quantity: `${requiredLovelace}`}, { unit: "44d5cc3395e94e805a24085cf275647b32c9aa7839e4d6bb4fe10f05744a", quantity: `${jukeboxTake}`}])
            )
        );

        console.log("jukebox outputs", outputs)

        const txHash = await finalizeTx({
            txBuilder,
            utxos,
            outputs,
            changeAddress: address,
        });
        console.log("SUCCESS")
        return {
            txHash,
        };
    } catch (error) {
        console.log(error, "in splitJukeboxTokens");
    }
};
