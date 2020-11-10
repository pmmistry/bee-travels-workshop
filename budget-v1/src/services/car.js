import axios from "axios";

const CAR_URL = process.env.CAR_URL || "http://localhost:9102";

export async function getCarData(country,city,dateFrom,dateTo) {
  const data = {
    dateFrom: dateFrom,
    dateTo: dateTo
  };
  const res = await axios.get(CAR_URL + `/api/v1/cars/${country}/${city}`, {params:data});
  return res.data;
}

export async function carReadinessCheck() {
  const isReady = await axios.get(CAR_URL + "/ready");
  return isReady;
}
