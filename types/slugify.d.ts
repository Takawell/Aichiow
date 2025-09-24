declare module "slugify" {
  function slugify(
    string: string,
    options?: {
      replacement?: string;
      remove?: RegExp;
      lower?: boolean;
      strict?: boolean;
      locale?: string;
      trim?: boolean;
    }
  ): string;

  export = slugify;
}
