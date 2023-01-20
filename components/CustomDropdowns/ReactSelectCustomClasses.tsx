export const ReactSelectCustomClasses = {
  classNames: {
    container() {
      return "relative";
    },
    menu() {
      return "!w-max flex flex-col border-borderLight dark:border-borderDark border-2 absolute right-1/2 translate-x-1/2";
    },
    menuList() {
      return "w-full bg-cardLight dark:bg-cardDark flex flex-col gap-1";
    },

    option() {
      return "bg-bgLight dark:bg-bgDark";
    },
    control() {
      return "bg-bgLight dark:bg-bgDark";
    },
    singleValue() {
      return "translate-x-2";
    },
  },
  unstyled: true,
};
