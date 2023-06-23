import {FcRating} from 'react-icons/fc'
import {HiLocationMarker} from 'react-icons/hi'
import {AiOutlineMail} from 'react-icons/ai'
import './index.css'

const SimilarJobDetailsList = props => {
  const {similarDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,

    rating,
    title,
    location,
  } = similarDetails
  return (
    <li className="job-details-container-1">
      <div className="job-sub-items">
        <div className="job-sub1-items">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="similar-job-logo"
          />
          <div className="type-container">
            <p className="job-type">{title}</p>
            <div className="job-rating">
              <FcRating className="job-rating1" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="desc">Description</h1>
      <p className="similar-job-para">{jobDescription}</p>
      <div className="location-job-container">
        <HiLocationMarker className="loc-logo" />
        <p className="job-location">{location}</p>
        <AiOutlineMail className="loc-logo" />
        <p className="job-location">{employmentType}</p>
      </div>
    </li>
  )
}
export default SimilarJobDetailsList
