import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'
import Loader from 'react-loader-advanced'
import withStyles from '@material-ui/core/styles/withStyles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CancelIcon from '@material-ui/icons/Cancel'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ClearIcon from '@material-ui/icons/Clear'
import Chip from '@material-ui/core/Chip'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import { selectInputStyles } from '../data/styles'
import states from '../data/States.js'

export const formatLgas = (data) => data.reduce((a, b) => ({
  ...a, state: { locals: [...a.state.locals, ...b.state.locals] }
})).state.locals.map(value => ({
  value: value.name.toLowerCase(), label: value.name.toLowerCase()
}))
class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event)
  };

  render () {
    const { children, isFocused, isSelected, onFocus } = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component='div'
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {children}
      </MenuItem>
    )
  }
}

function SelectWrapped (props) {
  const { classes, ...other } = props

  return (
    <Grid item xs={12}>
      <Select
        optionComponent={Option}
        noResultsText={<Typography>{'No results found'}</Typography>}
        arrowRenderer={arrowProps => {
          return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
        }}
        clearRenderer={() => <ClearIcon />}
        valueComponent={valueProps => {
          const { value, children, onRemove } = valueProps

          const onDelete = event => {
            event.preventDefault()
            event.stopPropagation()
            onRemove(value)
          }

          if (onRemove) {
            return (
              <Chip
                tabIndex={-1}
                label={children}
                className={classes.chip}
                deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
                onDelete={onDelete}
              />
            )
          }

          return <div className='Select-value'>{children}</div>
        }}
        {...other}
      />
    </Grid>
  )
}

class SelectInput extends React.Component {
  state = { answer: this.props.currentAnswer, error: '' }

  static defaultProps = {
    subField: false
  }

  getOptions = dataType => {
    switch (dataType) {
      case 'lga': return formatLgas(states)
    }
  }

  handleChange = (name, updateResponse) => (answer) => {
    const error = !/\w+/.test(answer)
    this.setState({ answer, error: error ? 'this field is required' : '' })

    const {
      question, questionId, creatorId, subQuestionField, updateSubQuestion
    } = this.props
    const record = { questionId, answer, creatorId }

    if (!error && !subQuestionField) {
      updateResponse({ variables: { record } })
    } else if (!error && subQuestionField) {
      updateSubQuestion({ ...record, question })
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    question: PropTypes.string.isRequired,
    questionId: PropTypes.string.isRequired,
    currentAnswer: PropTypes.string,
    creatorId: PropTypes.string.isRequired,
    externalData: PropTypes.string.isRequired,
    subQuestionField: PropTypes.bool,
    updateSubQuestion: PropTypes.func
  }

  static defaultProps = {
    subQuestionField: false
  }

  render () {
    const { classes, externalData } = this.props
    const { answer } = this.state

    return (
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={0}>
          <Mutation
            mutation={ADD_UPDATE_RESPONSE}
            children={(updateResponse, { data, loading, error: Error }) => {
              return <Loader show={loading} message={'please wait'}>
                <Input
                  fullWidth
                  inputComponent={SelectWrapped}
                  value={answer}
                  onChange={this.handleChange('single', updateResponse)}
                  placeholder={externalData}
                  id={`${externalData}-select`}
                  inputProps={{
                    classes,
                    name: `${externalData}-select`,
                    instanceId: `${externalData}-select`,
                    simpleValue: true,
                    options: this.getOptions(externalData)
                  }}
                />
              </Loader>
            }}
          />
        </Paper>
      </Grid>
    )
  }
}

export default withApollo(withStyles(selectInputStyles)(SelectInput))
