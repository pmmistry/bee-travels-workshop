import IllegalDateError from "../errors/IllegalDateError";

import { getHotelData, hotelReadinessCheck } from "./hotel";
import { getCarData, carReadinessCheck } from "./car";

export async function getData(country, city, filters, context) {
// step 1 - broken filters, date range is valid
  const {maxCost} = filters;

  if (parseDate(filters.dateTo) - parseDate(filters.dateFrom) < 0) {
    throw new IllegalDateError("from date can not be greater than to date");
  }

// step 2 : call the hotel service api end point 
const hotelData = await getHotelData(
  country,
  city,
  filters.dateFrom,
  filters.dateTo
  );

// step 3 : call car service api end point 
const carData = await getCarData(
  country,
  city,
  filters.dateFrom,
  filters.dateTo
);

// step 4 : find car & hotel based on max price , date range and location 
let results = [];
let hotelIndex;
let carIndex;
let budgetOutput;

//if price from hotel && price from car <= max price
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

// step 5 : return a list of hotel & car data based on max price , date range & location
 return results
}

function parseDate(date) {
  return Date.parse(date);
}
export async function readinessCheck() {
  return true;
}
