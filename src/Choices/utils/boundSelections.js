import memoize from 'fast-memoize'
import callIfExists from 'react-cake/es/utils/callIfExists'


export default memoize(
  (cb, propName) => ({addItem, deleteItem, ...state}) => callIfExists(
    cb,
    {
      [propName]: state[propName],
      select: addItem,
      deselect: deleteItem
    }
  )
)
