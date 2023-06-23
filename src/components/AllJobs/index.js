import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import JobCard from '../JobCard'

import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'IS_PROGRESS',
}

class AllJobs extends Component {
  state = {
    jobsList: [],
    apiJobStatus: apiStatusConstants.initial,
    apiProfileStatus: apiStatusConstants.initial,
    onSearch: '',
    employmentType: [],
    minimumPackage: '',
    profileData: [],
  }

  componentDidMount() {
    this.getAllJobsData()
    this.getProfileData()
  }

  getAllJobsData = async () => {
    this.setState({apiJobStatus: apiStatusConstants.isProgress})
    const {onSearch, employmentType, minimumPackage} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumPackage}&search=${onSearch}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        title: each.title,
        location: each.location,
        jobDescription: each.job_description,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
      }))
      this.setState({
        jobsList: updatedData,
        apiJobStatus: apiStatusConstants.success,
      })
    }
  }

  getProfileData = async () => {
    this.setState({apiProfileStatus: apiStatusConstants.isProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedDate = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedDate,
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  renderGetProductJobs = () => {
    const {jobsList} = this.state
    const jobLength = jobsList.length > 0
    return jobLength ? (
      <div className="job-list-container">
        <ul className="job-details-list">
          {jobsList.map(each => (
            <JobCard key={each.id} jobDetails={each} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-list-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-job-logo"
        />
        <h className="no-jobs-heading">No Jobs Find</h>
        <p className="no-jobs-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderProfileDataView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-logo-container">
        <img src={profileImageUrl} alt={name} className="profile-logo" />
        <h1 className="head">{name}</h1>
        <p className="para">{shortBio}</p>
      </div>
    )
  }

  retryProfile = () => {
    this.getProfileData()
  }

  renderProfileFailureView = () => (
    <>
      <h1>Profile Fail</h1>
      <button
        className="failure-btn"
        type="button"
        onClick={this.retryProfile()}
        id="button"
      >
        Retry
      </button>
    </>
  )

  renderGetJobsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something went wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.getAllJobsData}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onSearchClick = event => {
    this.setState({onSearch: event.target.value})
  }

  onEnterInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobsData()
    }
  }

  onSearchInputSubmit = () => {
    this.getAllJobsData()
  }

  onChangeSalary = event => {
    this.setState({minimumPackage: event.target.value}, this.getAllJobsData)
  }

  onChangeEmployeeList = event => {
    const {employmentType} = this.state
    if (employmentType.includes(event.target.id)) {
      const updatedCheckBox = employmentType.filter(
        each => each !== event.target.id,
      )
      this.setState({employmentType: updatedCheckBox}, this.getAllJobsData)
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getAllJobsData,
      )
    }
  }

  onCheckBoxViewTick = () => (
    <ul className="checkbox-view-container">
      {employmentTypesList.map(eachList => (
        <li
          className="check-box-list-container"
          key={eachList.employmentTypeId}
        >
          <input
            type="checkbox"
            id={eachList.employmentTypeId}
            className="checkbox-input"
            onChange={this.onChangeEmployeeList}
          />
          <label className="checkbox-label" htmlFor={eachList.employmentTypeId}>
            {eachList.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRadioViewList = () => (
    <ul className="radio-view-container">
      {salaryRangesList.map(eachRange => (
        <li className="check-box-list-container" key={eachRange.salaryRangeId}>
          <input
            type="radio"
            id={eachRange.salaryRangeId}
            className="checkbox-input"
            onChange={this.onChangeSalary}
          />
          <label className="checkbox-label" htmlFor={eachRange.salaryRangeId}>
            {eachRange.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderGetAllDetails = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.renderGetProductJobs()
      case apiStatusConstants.failure:
        return this.renderGetJobsFailureView()
      case apiStatusConstants.isProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileData = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDataView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.isProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSearchInput = () => {
    const {onSearch} = this.state
    return (
      <>
        <div className="search-bar-container">
          <input
            value={onSearch}
            className="search-bar"
            type="search"
            placeholder="Search"
            onChange={this.onSearchClick}
            onKeyDown={this.onEnterInput}
          />
          <button
            type="button"
            data-test-id="searchButton"
            className="search-btn"
            onClick={this.onSearchInputSubmit}
          >
            <AiOutlineSearch className="search-icon" />
          </button>
        </div>
      </>
    )
  }

  render() {
    return (
      <>
        <div className="job-profile-details-view-container">
          <div className="search-container">{this.renderSearchInput()}</div>
          <div className="left-side-container">
            <>{this.renderProfileData()}</>
            <hr className="hr-line" />
            <h1 className="type-text">Type of Employment</h1>
            {this.onCheckBoxViewTick()}
            <hr className="hr-line" />
            <h1 className="type-text">Salary Range</h1>
            {this.onRadioViewList()}
          </div>
          <div className="sub-job-container">
            {this.renderSearchInput()}
            {this.renderGetAllDetails()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
