import { ItemName } from '@pkmn/data';
import { Icons } from '@pkmn/img';

export const ItemIcon = ({ itemName }: { itemName: ItemName | string }) => <span style={Icons.getItem(itemName).css} />;
