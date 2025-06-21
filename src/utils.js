export const createPageUrl = (pageName) => {
  return `/${pageName.toLowerCase()}`;
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};