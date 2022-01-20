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
// mainnet addresses for royalites and dao fee
// const daoAddress =
// const artistAddress =

// Test Unsig PolicyId
export const unsigPolicyId =
  "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d";

// test addresses
const daoAddress = "addr_test1vqme2uc8smlyjc896e6s4sl9ayf4qxq6hp6g9rteajh0eyg677fcz" // from unsigs-market-plutus/testnet/treasury.addr
const artistAddress = "addr_test1vq9c8va8q9zledunvjg73m3zhndceu34h6z4ctmyavqkvegdkppxw" // from unsigs-market-plutus/testnet/creator.addr

export const offerAsset = async (datum, { address, utxosParam }) => {
  try {
    const { txBuilder, datums, outputs } = initializeTx();
    const utxos = utxosParam.map((utxo) =>
      Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
    );

    const offerAssetDatum = serializeOffer(datum);
    datums.add(offerAssetDatum);

    const assetName = toHex(fromStr(`unsig${datum.unsigId}`));

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

export const cancelOffer = async (
  datum,
  { address, utxosParam },
  assetUtxo
) => {
  try {
    const { txBuilder, datums, outputs } = initializeTx();

    const utxos = utxosParam.map((utxo) =>
      Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
    );

    const cancelListingDatum = serializeOffer(datum);
    datums.add(cancelListingDatum);

    const datumHash = toHex(
      Cardano.Instance.hash_plutus_data(cancelListingDatum).to_bytes()
    );

    console.log("datumHash", datumHash);

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

export const buyAsset = async (
  datum,
  { address, utxosParam },
  seller,
  assetUtxo
) => {
  try {
    const { txBuilder, datums, outputs } = initializeTx();

    const utxos = utxosParam.map((utxo) =>
      Cardano.Instance.TransactionUnspentOutput.from_bytes(fromHex(utxo))
    );

    const offerAssetDatum = serializeOffer(datum);
    datums.add(offerAssetDatum);

    outputs.add(
      createTxOutput(address.to_address(), assetUtxo.output().amount())
    );

    splitAmount({ seller, artistAddress, daoAddress }, datum.requestedAmount, outputs);

    const requiredSigners = Cardano.Instance.Ed25519KeyHashes.new();
    requiredSigners.add(address.payment_cred().to_keyhash());
    txBuilder.set_required_signers(requiredSigners);

    const txHash = await finalizeTx({
      txBuilder,
      utxos,
      outputs,
      datums,
      changeAddress: address,
      scriptUtxo: assetUtxo,
      plutusScripts: contractScripts(),
      action: BUY,
    });

    return txHash;
  } catch (error) {
    handleError(error, "buyAsset");
  }
};

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
      if (error.message.search("NonOutputSupplimentaryDatums") !== -1) {
        throw new Error(Errors.TRANSACTION_FAILED_DATUMS_NOT_MATCHING);
      } else if (error.message.search("MissingScriptWitnessesUTXOW") !== -1) {
        throw new Error(Errors.TRANSACTION_FAILED_WRONG_SCRIPT_CONTRACT);
      } else if (error.message.search("OutputTooSmallUTxO") !== -1) {
        throw new Error(Errors.TRANSACTION_FAILED_ASSET_NOT_SPENDABLE);
      }
      throw error;
  }
};

const splitAmount = (
  { seller, artistAddress, daoAddress },
  price,
  outputs
) => {
  const minimumAmount = 1000000;
  const daoFeePercentage = 125 / 10000;
  const royaltyFeePercentage = 125 / 10000;

  console.log("Artist", Cardano.Instance.Address.from_bech32(artistAddress))

  const royaltyFees = Math.max(royaltyFeePercentage * price, minimumAmount);
  outputs.add(
    createTxOutput(
      Cardano.Instance.Address.from_bech32(artistAddress),
      assetsToValue([{ unit: "lovelace", quantity: `${royaltyFees}` }])
    )
  );

  const daoFees = Math.max(daoFeePercentage * price, minimumAmount);
  outputs.add(
    createTxOutput(
      Cardano.Instance.Address.from_bech32(daoAddress),
      assetsToValue([{ unit: "lovelace", quantity: `${daoFees}` }])
    )
  );

  const netPrice =
    price - royaltyFeePercentage * price - daoFeePercentage * price;
  outputs.add(
    createTxOutput(
      seller.to_address(),
      assetsToValue([
        { unit: "lovelace", quantity: `${Math.max(netPrice, minimumAmount)}` },
      ])
    )
  );
};
