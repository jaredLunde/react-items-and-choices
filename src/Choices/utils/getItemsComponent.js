import Items, {ItemSet} from '../../Items'


export default function(obj) {
  return obj.push !== void 0 ? Items : ItemSet
}
