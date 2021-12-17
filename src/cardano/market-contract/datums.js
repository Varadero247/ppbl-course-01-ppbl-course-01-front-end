import Cardano from "../serialization-lib";
import Errors from "./errors";
import { fromHex, toHex, fromStr } from "../../utils/converter";

export const serializeOffer = ({ tradeOwner, requestedAmount, unsigId }) => {
  // unsigId is "unsig#####"
  const fields = Cardano.Instance.PlutusList.new();

  fields.add(Cardano.Instance.PlutusData.new_bytes(fromHex(tradeOwner)));
  fields.add(
    Cardano.Instance.PlutusData.new_integer(
      Cardano.Instance.BigInt.from_str(`${requestedAmount}`)
    )
  );
  fields.add(Cardano.Instance.PlutusData.new_bytes(fromStr(unsigId)));

  const datum = Cardano.Instance.PlutusData.new_constr_plutus_data(
    Cardano.Instance.ConstrPlutusData.new(
      Cardano.Instance.Int.new_i32(0),
      fields
    )
  );

  return datum;
};

export const deserializeOffer = (datum) => {
  const details = datum.as_constr_plutus_data().data();

  return {
    tradeOwner: toHex(details.get(0).as_bytes()),
    requestedAmount: details.get(1).as_integer().to_str(),
    unsigId: toHex(details.get(2).as_bytes()),
  };
};
