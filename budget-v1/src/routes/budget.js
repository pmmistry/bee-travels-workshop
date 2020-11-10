import { Router } from "express";
import { getData } from "../services/dataHandler";
import IllegalDateError from "../errors/IllegalDateError";
import Jaeger from "../jaeger";
import CircuitBreaker from "opossum";

const router = Router();

const opossumOptions = {
  timeout: 15000, // If our function takes longer than 15 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(getData, opossumOptions);

// TODO: fix jaeger and replace context
const context = {};

/**
 * GET /api/v1/budget/{country}/{city}
 * @tag Budget
 * @summary Get list of hotels and car rentals that fit a budget
 * @description Gets data for hotel and cars associated with a specific city and budget.
 * @pathParam {string} country - Country of the hotel using slug casing.
 * @pathParam {string} city - City of the hotel using slug casing.
 * @queryParam {string} dateFrom - Date From
 * @queryParam {string} dateTo - Date To
 * @queryParam {number} maxcost - Max Cost.
 * @response 200 - OK
 * @response 500 - Internal Server Error
 */
router.get("/:country/:city", async (req, res, next) => {
  // const context = new Jaeger("city", req, res);
  const { country, city } = req.params;
  
  const {
    maxcost,
    dateFrom,
    dateTo,
  } = req.query;
  req.log.info(`getting budget data for -> /${country}/${city}`);
 
  try {
    const data = await breaker.fire(
      country,
      city,
      {
        maxCost: parseInt(maxcost, 10) || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo|| undefined,
      },
      context
    );
    res.json(data);
  } catch (e) {
    console.log(e)
    next(e);
  }
});



export default router;
