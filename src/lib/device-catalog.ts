/** Initial suggestions only. Preserve free-form accurate manufacturer model entry. */
export const DEVICE_CLASSES = ["Phone","Laptop","Tablet","Desktop","Smartwatch","Game console","Audio device","Accessory","Other"] as const;
const common = ["Apple","Samsung","TECNO","Infinix","itel","Xiaomi","Redmi","OPPO","vivo","Nokia","Google","Huawei","Honor","HP","Dell","Lenovo","ASUS","Acer","Microsoft","Other"];
export const CLASS_BRANDS: Record<string,string[]> = {
  Phone:["Apple","Samsung","TECNO","Infinix","itel","Redmi","Xiaomi","OPPO","vivo","Nokia","Google","Huawei","Honor","Other"],
  Laptop:["Apple","HP","Dell","Lenovo","ASUS","Acer","Microsoft","Samsung","Huawei","Other"],
  Tablet:["Apple","Samsung","Lenovo","Huawei","Xiaomi","TECNO","Amazon","Other"],
  Desktop:["HP","Dell","Lenovo","Apple","ASUS","Acer","Other"],
  Smartwatch:["Apple","Samsung","Huawei","Xiaomi","Oraimo","Other"],
  "Game console":["Sony","Microsoft","Nintendo","Other"],
  "Audio device":["JBL","Sony","Oraimo","Bose","Apple","Samsung","Other"],
  Accessory:common,
  Other:common
};
export const PRODUCT_SUGGESTIONS: Record<string,string[]> = {
  Apple:["iPhone 11","iPhone 12","iPhone 13","iPhone 14","iPhone 15","iPhone 16","iPhone 17","MacBook Air","MacBook Pro","iPad","Apple Watch"],
  Samsung:["Galaxy A05","Galaxy A15","Galaxy A25","Galaxy A35","Galaxy A55","Galaxy S23","Galaxy S24","Galaxy S25","Galaxy Tab"],
  TECNO:["Spark","Camon","Phantom","Pova","Pop"],
  Infinix:["Hot","Note","Smart","Zero","GT"],
  itel:["A-series","P-series","S-series"],
  Redmi:["Redmi Note","Redmi A","Redmi 12","Redmi 13","Redmi 14"],
  Xiaomi:["Poco","Xiaomi 13","Xiaomi 14"],
  OPPO:["A-series","Reno","Find"],
  HP:["EliteBook","ProBook","Pavilion","Envy","Omen","EliteDesk"],
  Dell:["Latitude","Inspiron","XPS","Precision","OptiPlex"],
  Lenovo:["ThinkPad","IdeaPad","Yoga","Legion","ThinkCentre"]
};
