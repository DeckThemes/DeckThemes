export const ReactSelectCustomClasses = {
  classNames: {
    menu() {
      return "!w-max flex flex-col border-borderLight dark:border-borderDark border-2 rounded-xl";
    },
    menuList() {
      return "w-full bg-cardLight dark:bg-cardDark rounded-xl flex flex-col gap-1";
    },

    option() {
      return "bg-bgLight dark:bg-bgDark";
    },
    control() {
      return "bg-bgLight dark:bg-bgDark rounded-3xl";
    },
    singleValue() {
      return "translate-x-2";
    },
  },
  unstyled: true,
};
