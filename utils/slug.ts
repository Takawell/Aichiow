export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/^-+|-+$/g, ""); 
};

export const slugWithId = (str: string, id: number | string): string => {
  return `${toSlug(str)}-${id}`;
};

export const getIdFromSlug = (slug: string): string | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
};
