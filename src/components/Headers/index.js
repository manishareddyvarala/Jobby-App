import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Headers = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="headers-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="sub-1">
        <Link to="/">
          <li className="header-para">Home</li>
        </Link>
        <Link to="/jobs">
          <li className="header-para">Jobs</li>
        </Link>
      </ul>
      <button type="submit" className="log-out-btn" onClick={onLogout}>
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Headers)
