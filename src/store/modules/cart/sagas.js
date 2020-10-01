import { call, select, put, all, takeLatest } from "redux-saga/effects";
import { formatPrice } from "../../../util/format";

import api from "../../../services/api";

import { addToCartSuccess, updateAmount } from "./actions";

function* addToCart({ id }) {
  const productsExists = yield select((state) =>
    state.cart.find((p) => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productsExists ? productsExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    console.tron.warn("ERRO");
    return;
  }

  if (productsExists) {
    yield put(updateAmount(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
  }
}

export default all([takeLatest("@cart/ADD_REQUEST", addToCart)]);
