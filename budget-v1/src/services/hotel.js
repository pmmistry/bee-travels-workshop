import axios from "axios";

const HOTEL_URL = process.env.HOTEL_URL || "http://localhost:9101";

export async function getHotelData(country,city,dateFrom,dateTo) {
  
  
  const data = {
    dateFrom: dateFrom,
    dateTo: dateTo
  };

  const res = await axios.get(HOTEL_URL + `/api/v1/hotels/${country}/${city}`, {params:data});
  
 
  return res.data;

}

export async function hotelReadinessCheck() {
  const isReady = await axios.get(HOTEL_URL + "/ready");
  return isReady;
}
