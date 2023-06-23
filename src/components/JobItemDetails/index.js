import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FcRating} from 'react-icons/fc'
import {HiLocationMarker} from 'react-icons/hi'
import {AiOutlineMail} from 'react-icons/ai'
import {FiExternalLink} from 'react-icons/fi'
import Headers from '../Headers'
import SimilarJobDetailsList from '../SimilarJobDetailsList'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'IS_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemList: [],
    similarItemList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.isProgress})
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = [fetchedData.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_ur,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        id: each.id,
        skills: each.skills.map(skillItem => ({
          imageUrl: skillItem.image_url,
          name: skillItem.name,
        })),
        lifeAAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      const similarUpdatedData = fetchedData.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        location: eachItem.location,
        rating: eachItem.rating,
        jobDescription: eachItem.job_description,
        title: eachItem.title,
      }))
      this.setState({
        jobItemList: updatedData,
        similarItemList: similarUpdatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsDescription = () => {
    const {jobItemList, similarItemList} = this.state
    if (jobItemList.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        location,
        rating,
        skills,
        packagePerAnnum,
        jobDescription,
        title,
        lifeAAtCompany,
      } = jobItemList[0]

      const {description, imageUrl} = lifeAAtCompany
      return (
        <>
          <div className="job-bg-list-container">
            <div className="jobs-list-1">
              <div className="company-container">
                <img
                  src={companyLogoUrl}
                  alt="job Details company Logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="company-title">{title}</h1>
                  <div className="rating">
                    <FcRating className="rating-icons" />
                    <p className="company-rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="package-item-container">
                <div className="location-item-cont">
                  <HiLocationMarker className="loc-logo" />
                  <p className="location">{location}</p>
                  <AiOutlineMail className="loc-logo" />
                  <p className="location">{employmentType}</p>
                </div>
                <p className="per-annum">{packagePerAnnum}</p>
              </div>
              <hr className="hr" />
              <div className="description-container">
                <h1 className="desc">Description</h1>
                <a href={companyWebsiteUrl} className="visit-anchor">
                  Visit
                  <FiExternalLink />
                </a>
              </div>
              <p className="des-para">{jobDescription}</p>
              <h1 className="desc">Skills</h1>
              <ul className="skill-container">
                {skills.map(each => (
                  <li key={each.name} className="list-skill-item">
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-logo"
                    />
                    <p className="skill-para">{each.name}</p>
                  </li>
                ))}
              </ul>
              <h1 className="desc">Life at Company</h1>
              <div className="life-company-container">
                <p className="life-para">{description}</p>
                <img
                  src={imageUrl}
                  alt="life at company"
                  className="life-company"
                />
              </div>
            </div>
            <h1 className="job-heading">Similar Jobs</h1>
            <ul className="similar-list-container">
              {similarItemList.map(each => (
                <SimilarJobDetailsList key={each.id} similarDetails={each} />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  retryDetailsJob = () => {
    this.getJobItemDetails()
  }

  renderGetJobsDetailsFailureView = () => (
    <div className="failure-container-job">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something went wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.retryDetailsJob}
      >
        Retry
      </button>
    </div>
  )

  renderJobLoadingView = () => (
    <div className="loader-job-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderGetAllJobDetailsItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsDescription()
      case apiStatusConstants.failure:
        return this.renderGetJobsDetailsFailureView()
      case apiStatusConstants.isProgress:
        return this.renderJobLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Headers />
        <div className="job-item-details-container">
          {this.renderGetAllJobDetailsItems()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
