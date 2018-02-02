import React from 'react'
import PropTypes from 'prop-types'
import {Choices} from './Choices'
import ChoicesConsumer from './ChoicesConsumer'
import reduceProps from 'react-cake/es/utils/reduceProps'


class Choice extends React.PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    ...Choices.childContextTypes
  }

  constructor (props) {
    super(props)
    props.subscribe(this.setSelected)
    this.state = {isSelected: props.isSelected(props.value)}
  }

  componentWillUnmount () {
    this.props.unsubscribe(this.setSelected)
  }

  setSelected = () => this.setState({
    isSelected: this.props.isSelected(this.props.value)
  })

  select = () => this.props.select(this.props.value)
  deselect = () => this.props.deselect(this.props.value)
  toggle = () => this.props.toggle(this.props.value)

  render () {
    let {children, value, ...props} = this.props
    props = reduceProps(props, Choices.childContextTypes)

    return children({
      value,
      select: this.select,
      deselect: this.deselect,
      toggle: this.toggle,
      isSelected: this.state.isSelected,
      ...props
    })
  }
}


export default function (props) {
  return <ChoicesConsumer children={pProps => <Choice {...pProps} {...props}/>}/>
}
