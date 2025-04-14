/** @format */

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
declare module "*.jpeg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
declare module "*.gif" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
declare module "*.svg" {
  const content: any;
  export default content;
}
declare module "*.webp" {
  const content: any;
  export default content;
}
declare module "@env" {
  export const API_URL: string;
}
