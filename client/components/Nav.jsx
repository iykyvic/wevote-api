import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Img from 'react-image'
import Loader from 'react-loader-advanced'
import compose from 'recompose/compose'
import Hidden from 'material-ui/Hidden'
import withWidth from 'material-ui/utils/withWidth'
import { withApollo } from 'react-apollo'
import {
  AppBar,
  Avatar,
  Button,
  Switch,
  Toolbar,
  Typography,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  IconButton
} from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import Facebook from 'material-ui-next-community-icons/icons/facebook-box'
import AccountCircle from 'material-ui-icons/AccountCircle'
import BookIcon from 'material-ui-icons/LibraryBooks'
import { navStyles } from '../data/styles'

export const UserAvatar = (props) => {
  const style = props.style || {
    margin: 10,
    width: 30,
    height: 30
  }
  return <Avatar
    alt={props.alt}
    children={
      <Img
        style={style}
        src={[props.imageUrl, 'https://via.placeholder.com/30x30']}
        loader={<Loader show message={'please wait'} />}
      />
    }
    style={style}
  />
}

UserAvatar.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  style: PropTypes.object,
  alt: PropTypes.string.isRequired
}

class Nav extends Component {
  state = {
    anchorEl: null
  }
  static LoginLink = props => <a href={'/api/v1/auth/facebook'} {...props} />
  static propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.shape(),
    history: PropTypes.shape().isRequired
  }

  static contextTypes: {
    router: PropTypes.func.isRequired
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleCloseMenu = (href) => {
    this.setState({ anchorEl: null })

    if (typeof href === 'string') {
      this.props.history.push(href)
    }
  };

  render () {
    const { user, classes, title, logout, history } = this.props
    const auth = user && user.emails !== null
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const LogoutToggle = () => <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={auth}
            onChange={logout.bind(null, true, '/')}
            aria-label='LoginSwitch'
          />
        }
        label={
          auth
            ? <span className={classes.navspan} >Logout</span>
            : <span className={classes.navspan} >Login</span>
        }
      />
    </FormGroup>
    const LoginButton = (
      <Button component={Nav.LoginLink} color='inherit'>
        Login
        <Facebook className={classes.rightIcon} />
      </Button>
    )

    return (
      <AppBar position='static' className={classes.appBar}>
        <Toolbar>
          <Typography variant='title' color='inherit' className={classes.flex}>
            <Link className={classes.links} to='/'>{title} </Link>
          </Typography>
          { auth
            ? <div className={classes.extra} >
              <Hidden only={['xs', 'sm']}>
                <span className={classes.displayname}>
                    Hi! {user.displayName.split(' ')[0]}
                </span>
              </Hidden>
              <LogoutToggle />
              {history.location.pathname === '/profile' ? null : <UserAvatar
                alt={user.displayName}
                imageUrl={user.photos[0].value}
              />}
            </div> : LoginButton
          }
          <IconButton
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup='true'
            onClick={this.handleOpenMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='menu-appbar'
            className={classes.menuAppbar}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={open}
            onClose={this.handleCloseMenu}
          >
            { auth && history.location.pathname !== '/profile'
              ? <MenuItem
                onClick={this.handleCloseMenu.bind(null, '/profile')}
                className={classes.menuItem}
              >
                <AccountCircle className={classes.menuIcon} /> View Profile
              </MenuItem>
              : null
            }

            <MenuItem
              onClick={this.handleCloseMenu.bind(null, '/news')}
              className={classes.menuItem}
            >
              <BookIcon className={classes.menuIcon} /> Election News
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withApollo, withStyles(navStyles), withWidth(), withRouter
)(Nav)
