import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'

import './index.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    activeProjectType: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeProjectType} = this.state
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeProjectType}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(projectsApiUrl, options)
    const data = await response.json()
    // console.log(data)
    // console.log(response)
    if (response.ok === true) {
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#328af2" />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-container">
        {projectsList.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderApiResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeProjectType = event => {
    // console.log(event.target.value)
    this.setState({activeProjectType: event.target.value}, this.getProjectsList)
  }

  render() {
    const {activeProjectType} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <div className="header-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </div>
        </nav>
        <div className="projects-container">
          <select
            className="dropdown-input"
            id="dropdown"
            value={activeProjectType}
            onChange={this.onChangeProjectType}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          <div className="results-container">{this.renderApiResults()}</div>
        </div>
      </div>
    )
  }
}
export default Home
