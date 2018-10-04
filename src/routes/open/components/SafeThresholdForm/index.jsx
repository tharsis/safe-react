// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Field from '~/components/forms/Field'
import SelectField from '~/components/forms/SelectField'
import { composeValidators, minValue, mustBeInteger, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { FIELD_CONFIRMATIONS, getNumOwnersFrom } from '~/routes/open/components/fields'
import { md } from '~/theme/variables'

type Props = {
  classes: Object,
  values: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
  owners: {
    paddingLeft: md,
  },
})

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  const numOwners = getNumOwnersFrom(values)
  if (numOwners < Number.parseInt(values[FIELD_CONFIRMATIONS], 10)) {
    errors[FIELD_CONFIRMATIONS] = CONFIRMATIONS_ERROR
  }

  return errors
}

const SafeThreshold = ({ classes, values }: Props) => {
  const numOwners = getNumOwnersFrom(values)

  return (
    <React.Fragment>
      <Block className={classes.title} margin="md">
        <Paragraph size="lg" color="primary" weight="bolder" noMargin>
          Set the required owner confirmations:
        </Paragraph>
      </Block>
      <Block margin="lg">
        <Paragraph noMargin size="md" color="primary" weight="light">
          Every transaction outside any specified daily limits, needs to be confirmed by all
          specified owners. If no daily limits are set, all owners will need to sign for transactions.
        </Paragraph>
      </Block>
      <Block margin="xs">
        <Paragraph noMargin size="md" color="primary" weight="bolder">
          Any transaction over any daily limit requires the confirmation of:
        </Paragraph>
      </Block>
      <Row margin="xl" align="center">
        <Col xs={2}>
          <Field
            name={FIELD_CONFIRMATIONS}
            component={SelectField}
            validate={composeValidators(
              required,
              mustBeInteger,
              minValue(1),
            )}
          >
            {
              [...Array(Number(numOwners))].map((x, index) => (
                <MenuItem key={`selectOwner${index}`} value={`${index + 1}`}>{index + 1}</MenuItem>
              ))
            }
          </Field>
        </Col>
        <Col xs={10}>
          <Paragraph size="lg" color="primary" noMargin className={classes.owners}>
            out of {numOwners} owner(s)
          </Paragraph>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const SafeThresholdForm = withStyles(styles)(SafeThreshold)

const SafeOwnersPage = () => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls}>
      <SafeThresholdForm values={values} />
    </OpenPaper>
  </React.Fragment>
)


export default SafeOwnersPage
