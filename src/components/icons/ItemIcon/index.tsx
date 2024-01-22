import { ItemName } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useTranslation } from 'next-i18next';

type ItemIconProps = {
  itemName: ItemName | string;
};

export const ItemIcon = ({ itemName }: ItemIconProps) => {
  const { t } = useTranslation(['items']);
  const itemIconStyle = Icons.getItem(itemName).css;

  return <span className="inline-block" role="img" title={t(`items.${itemName.toLowerCase()}`)} style={itemIconStyle} />;
};
