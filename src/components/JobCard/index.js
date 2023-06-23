import {FcRating} from 'react-icons/fc'
import {GoLocation} from 'react-icons/go'
import {FiMail} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    title,
    location,
    jobDescription,
    packagePerAnnum,
    rating,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-card-container">
        <div className="company-logo-container">
          <img src={companyLogoUrl} alt={title} className="job-title" />

          <div className="title-rating">
            <p className="title">{title}</p>
            <div className="rating-container">
              <FcRating className="rat" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="package-container">
          <div className="location-cont">
            <GoLocation className="loc-logo" />
            <p className="location">{location}</p>
            <FiMail className="loc-logo" />
            <p className="location">{employmentType}</p>
          </div>

          <p className="per-annum">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <p className="desc">Description</p>
        <p className="job-desc">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
