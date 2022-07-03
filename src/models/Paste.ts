import { ObjectId } from 'mongodb';

import { Pokemon } from '@/models/Pokemon';

export interface Paste {
  _id: ObjectId;
  author: string;
  notes: string;
  paste: string;
  title: string;
  team: Pokemon[];
}
