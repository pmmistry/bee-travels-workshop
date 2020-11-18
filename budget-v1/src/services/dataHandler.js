import IllegalDateError from "../errors/IllegalDateError";

import { getHotelData, hotelReadinessCheck } from "./hotel";
import { getCarData, carReadinessCheck } from "./car";

export async function getData(country, city, filters, context) {
// step 1: Makes sure date range is valid
  const {maxCost} = filters;

  if (parseDate(filters.dateTo) - parseDate(filters.dateFrom) < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }

// step 2 : Calls the hotel service api end point 
const hotelData = await getHotelData(
  country,
  city,
  filters.dateFrom,
  filters.dateTo
  );

// step 3 : Calls the car service api end point 
const carData = await getCarData(
  country,
  city,
  filters.dateFrom,
  filters.dateTo
);

// step 4 : Finds car and hotel based on max price , date range and location
let results = [];
let hotelIndex;
let carIndex;
let budgetOutput;


for (hotelIndex = 0; hotelIndex < hotelData.length; hotelIndex ++){
  if(hotelData[hotelIndex].cost <= maxCost){
    
    for(carIndex = 0; carIndex < carData.length; carIndex ++){
      budgetOutput  = hotelData[hotelIndex].cost + carData[carIndex].cost;
      if(budgetOutput <= maxCost){
        results.push({hotel:{id:hotelData[hotelIndex].id,name:hotelData[hotelIndex].name},
        car:{id:carData[carIndex].id,name:carData[carIndex].name},cost:budgetOutput});
      }
    }

  } 
}

// step 5 : Return a list of hotel and car data combinations based on max price, date range and location
 return results
}

function parseDate(date) {
  return Date.parse(date);
}
export async function readinessCheck() {
  return true;
}
