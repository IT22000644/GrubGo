export type VehicleType = "bike" | "car" | "threewheel" | "van" | "lorry";
export type VehicleColor =
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "white"
  | "black"
  | "purple";

const fallbackCar = "https://cdn-icons-png.flaticon.com/128/3085/3085330.png";

const vehicleIcons: Record<
  VehicleType,
  Partial<Record<VehicleColor, string>>
> = {
  car: {
    red: "https://cdn-icons-png.flaticon.com/128/3085/3085330.png",
    yellow: "https://cdn-icons-png.flaticon.com/128/3089/3089803.png",
    blue: "https://cdn-icons-png.flaticon.com/128/18042/18042076.png",
    green: "https://cdn-icons-png.flaticon.com/128/12723/12723308.png",
    white: "https://cdn-icons-png.flaticon.com/128/2481/2481801.png",
    black: "https://cdn-icons-png.flaticon.com/128/9851/9851669.png",
    purple: "https://cdn-icons-png.flaticon.com/128/4931/4931621.png",
  },
  bike: {
    red: "https://cdn-icons-png.flaticon.com/128/3149/3149029.png",
    yellow: "https://cdn-icons-png.flaticon.com/128/2173/2173566.png",
    blue: "https://cdn-icons-png.flaticon.com/128/2173/2173550.png",
    green: "https://cdn-icons-png.flaticon.com/128/10771/10771949.png",
    white: "https://cdn-icons-png.flaticon.com/128/5811/5811814.png",
    black: "https://cdn-icons-png.flaticon.com/128/9983/9983173.png",
    purple: "https://cdn-icons-png.flaticon.com/128/5008/5008303.png",
  },
  threewheel: {
    red: "https://cdn-icons-png.flaticon.com/128/5768/5768851.png",
    yellow: "https://cdn-icons-png.flaticon.com/128/3205/3205236.png",
    blue: "https://cdn-icons-png.flaticon.com/128/3305/3305718.png",
    green: "https://cdn-icons-png.flaticon.com/128/4786/4786821.png",
    white: "https://cdn-icons-png.flaticon.com/128/1693/1693203.png",
    black: "https://cdn-icons-png.flaticon.com/128/4786/4786732.png",
    purple: "https://cdn-icons-png.flaticon.com/128/18344/18344113.png",
  },
  van: {
    red: "https://cdn-icons-png.flaticon.com/128/2290/2290690.png",
    yellow: "https://cdn-icons-png.flaticon.com/128/3097/3097224.png",
    blue: "https://cdn-icons-png.flaticon.com/128/5440/5440902.png",
    green: "https://cdn-icons-png.flaticon.com/128/3085/3085338.png",
    white: "https://cdn-icons-png.flaticon.com/128/386/386405.png",
    black: "https://cdn-icons-png.flaticon.com/128/1048/1048326.png",
    purple: "https://cdn-icons-png.flaticon.com/128/5433/5433837.png",
  },
  lorry: {
    red: "https://cdn-icons-png.flaticon.com/128/15384/15384751.png",
    yellow: "https://cdn-icons-png.flaticon.com/128/605/605661.png",
    blue: "https://cdn-icons-png.flaticon.com/128/5811/5811420.png",
    green: "https://cdn-icons-png.flaticon.com/128/5092/5092675.png",
    white: "https://cdn-icons-png.flaticon.com/128/2813/2813008.png",
    black: "https://cdn-icons-png.flaticon.com/128/7191/7191254.png",
    purple: "https://cdn-icons-png.flaticon.com/128/5207/5207184.png",
  },
};

export function getVehicleIconUrl(
  type: VehicleType = "car",
  color: VehicleColor = "blue"
): string {
  return (
    vehicleIcons[type]?.[color] ??
    Object.values(vehicleIcons[type] || {})[0] ??
    fallbackCar
  );
}
