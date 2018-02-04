import React from 'react'
import PropTypes from 'prop-types'
import callIfExists from 'react-cake/es/utils/callIfExists'
import {minLengthInvariant} from '../invariants'
import {boundAddItem, boundDeleteItem} from './utils'


export default class Items extends React.PureComponent {
  static propTypes = {
    // The name of the property passed to the child component representing
    // the current sequence of items
    propName: PropTypes.string.isRequired,
    // The initial items in the sequence
    initialItems: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(Set)
    ]).isRequired,
    // Minimum number of items to allow
    minItems: PropTypes.number,
    // Maximum number of items to allow
    maxItems: PropTypes.number,
    // Called when the number of items offered is outside the bounds of
    // minItems
    onBoundMin: PropTypes.func,
    // Called when the number of items offered is outside the bounds of
    // maxItems
    onBoundMax: PropTypes.func,
    // Called when a choice is selected or deselected
    onChange: PropTypes.func,
    // Called when an item is added to the sequence
    onAdd: PropTypes.func,
    // Called when an item is deleted from the sequence
    onDelete: PropTypes.func
  }

  static defaultProps = {
    propName: 'items',
    initialItems: []
  }

  constructor (props) {
    super(props)

    const {initialItems, propName, ...otherProps} = props
    this.state = {
      ...boundAddItem(...initialItems)(
        {
          [propName]: initialItems.push !== void 0 ? [] : new Set()
        },
        {
          propName,
          ...otherProps
        }
      )
    }
  }

  get items () {
    return this.state[this.props.propName]
  }

  handleChange = () => callIfExists(this.props.onChange, this.items)

  addItem = (...items) => this.setState(
    boundAddItem(...items),
    () => {
      this.handleChange()
      callIfExists(this.props.onAdd, this.items)
    }
  )

  deleteItem = (...items) => this.setState(
    boundDeleteItem(...items),
    () => {
      this.handleChange()
      callIfExists(this.props.onDelete, this.items)
    }
  )

  clearItems = () => this.setState(
    (state, {minItems, propName}) => {
      const newState = {[propName]: state[propName].push !== void 0 ? [] : new Set()}
      minLengthInvariant(newState[propName], minItems)
      return newState
    },
    this.handleChange
  )

  setItems = newItems => {
    this.setState(
      (state, {propName}) => ({
        [propName]: state[propName].push !== void 0 ? [] : new Set()
      })
    )

    this.setState(boundAddItem(...newItems), this.handleChange)
  }

  includes = value => {
    const v = this.state[this.props.propName]
    return v[v.includes !== void 0 ? 'includes' : 'has'](value)
  }

  render () {
    return this.props.children({
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      setItems: this.setItems,
      clearItems: this.clearItems,
      includes: this.includes,
      [this.props.propName]: this.state[this.props.propName]
    })
  }
}
