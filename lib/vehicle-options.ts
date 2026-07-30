// Option lists for the "Find Vehicle" filter form on /request.
// Kept in one file so the same list can be reused if we ever add a
// second form (e.g. an admin-side saved-search builder).

export const VEHICLE_TYPES = [
  "Automobile", "SUV", "Pickup Truck", "Van/Minivan", "Motorcycle",
  "Med./Heavy Duty Truck", "Boat", "RV", "Other",
];

export const MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia",
  "Lexus", "Mazda", "Mercedes-Benz", "Nissan", "Ram", "Subaru", "Tesla",
  "Toyota", "Volkswagen", "Volvo", "Other",
];

export const LOSS_TYPES = [
  "Collision", "Fire", "Flood", "Hail", "Theft", "Vandalism",
  "Mechanical", "Rollover", "Other",
];

export const PRIMARY_DAMAGE = [
  "Front End", "Rear End", "Side", "Right Front", "Left Front",
  "Right Rear", "Left Rear", "Rollover", "Water/Flood", "Burn",
  "Undercarriage", "All Over", "Minor Dent/Scratches", "Unknown",
];

export const TITLE_TYPES = [
  "Clean", "Salvage", "Rebuilt/Reconstructed", "Certificate of Destruction",
  "Bill of Sale", "Parts Only", "Non-Repairable",
];

export const SALES_TYPES = ["On Approval", "Buy It Now", "Pure Sale"];

export const START_CODES = [
  "Run & Drive Verified", "Enhanced Vehicles", "Engine Start Program", "Stationary", "Unknown",
];

export const FUEL_TYPES = ["Gas", "Diesel", "Hybrid", "Electric", "Flex Fuel", "Other"];

export const TRANSMISSIONS = ["Automatic", "Manual", "Other"];

export const DRIVETRAINS = ["FWD", "RWD", "AWD", "4WD"];

export const BODY_STYLES = [
  "Sedan", "Coupe", "Hatchback", "Wagon", "SUV", "Pickup", "Van", "Convertible", "Other",
];

export const COLORS = [
  "Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Brown",
  "Beige", "Gold", "Orange", "Yellow", "Purple", "Other",
];

export const AIRBAG_OPTIONS = ["Deployed", "Not Deployed", "Unknown"];

export const ODOMETER_RANGES = [
  "Under 25,000", "25,000–50,000", "50,000–75,000", "75,000–100,000",
  "100,000–150,000", "Over 150,000", "Not Actual/Exempt",
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY",
];
