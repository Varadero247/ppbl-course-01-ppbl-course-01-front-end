import Cardano from "../serialization-lib";
import Errors from "./errors";
import { serializeOffer, deserializeOffer } from "./datums";
import { CANCEL, BUY } from "./redeemers";
import { contractAddress, contractScripts } from "./validator";
import {
  assetsToValue,
  createTxOutput,
  finalizeTx,
  initializeTx,
} from "../transaction";
import { fromHex, fromStr, toHex } from "../../utils/converter";


// Unsig PolicyId
// const unsigPolicyId = "0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04";

// Test Unsig PolicyId
const unsigPolicyId = "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d";
                    // 1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d

export const offerAsset = async (
  datum,
  { address, utxosParam }
) => {
  try {
    const { txBuilder, datums, outputs } = initializeTx();
    const utxos = utxosParam.map((utxo) =>

      Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))

    );

    const offerAssetDatum = serializeOffer(datum);
    datums.add(offerAssetDatum);

    const assetName = toHex(fromStr(`unsig${datum.unsigId}`));
    console.log("asset name", assetName)

    outputs.add(
      createTxOutput(
        contractAddress(),
        assetsToValue([
          {
            unit: `${unsigPolicyId}${assetName}`,
            quantity: "1",
          },
          { unit: "lovelace", quantity: "2000000" }, // why don't we see this in SpaceBudz repo?
        ]),
        { datum: offerAssetDatum }
      )
    );

    const datumHash = toHex(
      Cardano.Instance.hash_plutus_data(offerAssetDatum).to_bytes()
    );

    console.log("before", utxos, outputs)

    const txHash = await finalizeTx({
      txBuilder,
      datums,
      utxos,
      outputs,
      changeAddress: address,
      metadata: deserializeOffer(offerAssetDatum),
    });
    return {
      datumHash,
      txHash,
    };
  } catch (error) {
    handleError(error, "offerAsset");
  }
};

export const cancelOffer = async (datum, { address, utxosParam }, assetUtxo) => {

  try {
    const { txBuilder, datums, outputs } = initializeTx();

    const utxos = utxosParam.map((utxo) =>
      Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
    );

    const cancelListingDatum = serializeOffer(datum);
    datums.add(cancelListingDatum);

    outputs.add(
      createTxOutput(address.to_address(), assetUtxo.output().amount())
    );

    const requiredSigners = Cardano.Instance.Ed25519KeyHashes.new();
    requiredSigners.add(address.payment_cred().to_keyhash());
    txBuilder.set_required_signers(requiredSigners);

    const txHash = await finalizeTx({
      txBuilder,
      datums,
      utxos,
      outputs,
      changeAddress: address,
      scriptUtxo: assetUtxo,
      plutusScripts: contractScripts(),
      action: CANCEL,
    });

    return txHash;
  } catch (error) {
    handleError(error, "cancelOffer");
  }
};


// export const buyAsset = async (
//   datum,
//   buyer: { address: BaseAddress, utxos: [] },
//   beneficiaries: {
//     seller: BaseAddress,
//     artist: BaseAddress,
//     market: BaseAddress,
//   },
//   assetUtxo
// ) => {
//   try {
//     const { txBuilder, datums, outputs } = initializeTx();

//     const utxos = buyer.utxos.map((utxo) =>
//       Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
//     );

//     const offerAssetDatum = serializeOffer(datum);
//     datums.add(offerAssetDatum);

//     outputs.add(
//       createTxOutput(buyer.address.to_address(), assetUtxo.output().amount())
//     );

//     splitAmount(beneficiaries, datum.requestedAmount, outputs);

//     const requiredSigners = Cardano.Instance.Ed25519KeyHashes.new();
//     requiredSigners.add(buyer.address.payment_cred().to_keyhash());
//     txBuilder.set_required_signers(requiredSigners);

//     const txHash = await finalizeTx({
//       txBuilder,
//       utxos,
//       outputs,
//       datums,
//       changeAddress: buyer.address,
//       scriptUtxo: assetUtxo,
//       plutusScripts: contractScripts(),
//       action: BUY,
//     });

//     return txHash;
//   } catch (error) {
//     handleError(error, "buyAsset");
//   }
// };

const handleError = (error, source) => {
  console.error(`Unexpected error in ${source}. [Message: ${error.message}]`);

  switch (error.message) {
    case "INPUT_LIMIT_EXCEEDED":
      throw new Error(Errors.TRANSACTION_FAILED_SO_MANY_UTXOS);
    case "INPUTS_EXHAUSTED":
      throw new Error(Errors.TRANSACTION_FAILED_NOT_ENOUGH_FUNDS);
    case "MIN_UTXO_ERROR":
      throw new Error(Errors.TRANSACTION_FAILED_CHANGE_TOO_SMALL);
    case "MAX_SIZE_REACHED":
      throw new Error(Errors.TRANSACTION_FAILED_MAX_TX_SIZE_REACHED);
    default:
      if (error.message.search("OutputTooSmallUTxO") !== -1) {
        throw new Error(Errors.TRANSACTION_FAILED_ASSET_NOT_SPENDABLE);
      }
      throw error;
  }
};

const splitAmount = (
  { seller, artist, market },
  price,
  outputs
) => {
  // TODO: Fees Calculation.
};
