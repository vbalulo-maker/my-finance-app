// src/utils/categoryIcons.js
import {
  IconShoppingCart,
  IconCoffee,
  IconCar,
  IconDeviceGamepad,
  IconBuildingStore,
  IconHome,
  IconCreditCard,
  IconBarbell,
  IconTool,
  IconDots,
  IconCash,
  IconPercentage,
  IconArrowsExchange,
  IconTag,
} from '@tabler/icons-react';

const ICON_MAP = {
  'Супермаркеты': IconShoppingCart,
  'Кафе': IconCoffee,
  'Транспорт': IconCar,
  'Развлечения': IconDeviceGamepad,
  'Маркетплейсы': IconBuildingStore,
  'Аренда': IconHome,
  'Кредит': IconCreditCard,
  'Спорт': IconBarbell,
  'Услуги': IconTool,
  'Другое': IconDots,
  'Зарплата': IconCash,
  '% по вкладам': IconPercentage,
  'Переводы': IconArrowsExchange,
};

export const getCategoryIcon = (category) => ICON_MAP[category] || IconTag;