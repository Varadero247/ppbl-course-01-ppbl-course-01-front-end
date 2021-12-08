import Cardano from "../serialization-lib";
import Errors from "./errors";
import { fromHex, toHex } from "../../utils/converter";

export const serializeOffer = ({ tradeOwner, requestedAmount, unsigId }) => {
  const fieldsInner = Cardano.Instance.PlutusList.new();

  fieldsInner.add(Cardano.Instance.PlutusData.new_bytes(fromHex(tradeOwner)));
  fieldsInner.add(
    Cardano.Instance.PlutusData.new_bytes(fromHex(unsigId))
  );
  fieldsInner.add(
    Cardano.Instance.PlutusData.new_integer(
      Cardano.Instance.BigInt.from_str(requestedAmount)
    )
  );

  const tradeDetails = Cardano.Instance.PlutusList.new();
  tradeDetails.add(
    Cardano.Instance.PlutusData.new_constr_plutus_data(
      Cardano.Instance.ConstrPlutusData.new(
        Cardano.Instance.Int.new_i32(0),
        fieldsInner
      )
    )
  );

  const datum = Cardano.Instance.PlutusData.new_constr_plutus_data(
    Cardano.Instance.ConstrPlutusData.new(
      Cardano.Instance.Int.new_i32(DATUM_TYPE.Offer),
      tradeDetails
    )
  );

  return datum;
};

export const deserializeOffer = (datum) => {
  const datumType = offerUtxo.datum.as_constr_plutus_data().tag().as_i32();

  if (datumType !== DATUM_TYPE.Offer)
      throw new Error(Errors.COULD_NOT_DESERIALIZE_DATUM_WRONG_TYPE);

  const tradeDetails = datum.as_constr_plutus_data().data().get(0).data();

  return {
    tradeOwner: toHex(tradeDetails.get(0).as_bytes()),
    requestedAmount: toHex(tradeDetails.get(2).as_integer().to_str(),
    unsigId: toHex(tradeDetails.get(1).as_bytes()),
  };
};

const DATUM_TYPE = {
  StartBid: 0,
  Bid: 1,
  Offer: 2,
};
