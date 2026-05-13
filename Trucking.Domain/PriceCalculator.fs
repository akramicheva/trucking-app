namespace Trucking.Domain

open System


type CargoType = 

    | Standard
    | Fragile      
    | Hazardous    

    | Refrigerated 

type RouteInfo = {
    DistanceKm: decimal
    IsInternational: bool
}

[<CLIMutable>]
type Cargo = {
    WeightKg: decimal
    Type: CargoType
}


type PricingError = 
    | InvalidDistance
    | WeightLimitExceeded of maxWeight: decimal


module PriceCalculator =
    let private BaseRate = 1.5m 
    let private MaxWeight = 25000.0m

    let calculatePrice (cargo: Cargo) (route: RouteInfo) =
        if route.DistanceKm <= 0.0m then 
            Error InvalidDistance
        elif cargo.WeightKg > MaxWeight then 
            Error (WeightLimitExceeded MaxWeight)
        else

            let typeMultiplier = 
                match cargo.Type with

                | Standard -> 1.0m
                | Fragile -> 1.25m
                | Refrigerated -> 1.3m
                | Hazardous -> 1.5m

            let routeMultiplier = if route.IsInternational then 1.4m else 1.0m
            
            // Расчет: Дистанция * Ставка * Коэффициенты * Надбавка за вес (10% за каждые 10т)
            let weightExtra = 1.0m + (cargo.WeightKg / 10000.0m * 0.1m)
            
            let total = route.DistanceKm * BaseRate * typeMultiplier * routeMultiplier * weightExtra

            Ok (Math.Round(total, 2))