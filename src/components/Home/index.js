import {Link} from 'react-router-dom'
import Headers from '../Headers'

import './index.css'

const Home = () => (
  <>
    <Headers />
    <div className="home-container">
      <div className="sub-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-para">
          Millions of people are searching for jobs,salary information,compony
          reviews.Find the job that fit your abilities and potential
        </p>

        <Link to="/jobs">
          <button className="find-btn" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
