// Ambient type declarations for CSS imports (global side-effect + CSS Modules).
declare module "*.css";

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
