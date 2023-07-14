import React, {useEffect, useState} from 'react';
import { graphql } from 'gatsby';
import { format, isValid, parse } from 'date-fns';
import Helmet from 'react-helmet';
import './index.css';

const RoadmapPage = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy] = useState('Due_date'); // State to store the sorting field
  const [sortDirection, setSortDirection] = useState('asc'); // State to store the sorting direction

  const [filterStatus, setFilterStatus] = useState('');
  const [numItems, setNumItems] = useState(0);

  const { allRoadmapJson } = data;
  const { edges } = allRoadmapJson;

  const filteredEdges = edges.filter((edge) => {
    const { node } = edge;

    // Filtrar por el campo Summary y Status
    if (
      node.Summary.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === '' ||
        node.Status.toLowerCase() === filterStatus.toLowerCase())
    ) {
      return true;
    }

    // Filtrar por todos los campos
    const values = Object.values(node);
    return values.some((value) => {
      if (typeof value === 'string') {
        return (
          value.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus === '' ||
            value.toLowerCase() === filterStatus.toLowerCase())
        );
      }
      return false;
    });
  });

  const sortedEdges = filteredEdges.sort((a, b) => {
    const { node: nodeA } = a;
    const { node: nodeB } = b;

    // Compare date fields using date-fns parse
    const dateA = parse(nodeA.Due_date, 'LLLL yyyy', new Date());
    const dateB = parse(nodeB.Due_date, 'LLLL yyyy', new Date());

    if (sortBy === 'Due_date') {
      if (sortDirection === 'asc') {
        return dateA > dateB ? 1 : -1;
      } else if (sortDirection === 'desc') {
        return dateA < dateB ? 1 : -1;
      }
    }

    // If a valid sorting field is not provided, maintain the current order
    return 0;
  });

  const toggleDetails = (index) => {
    const detailsRow = document.getElementById(`row-details-${index}`);
    const detailsChevron = document.getElementById(`fa-chevron-down-${index}`);
    if ((detailsRow, detailsChevron)) {
      detailsRow.classList.toggle('show-details');
      detailsChevron.classList.toggle('rotate');
    }
  };

  const formatDate = (dateString) => {
    const parsedDate = parse(dateString, 'LLLL yyyy', new Date());
    if (!isValid(parsedDate)) {
      return ''; // O cualquier otro valor predeterminado en caso de fecha inválida
     }
    return format(parsedDate, 'LLL yyyy');
  };

  const handleSortDirection = (event) => {
    setSortDirection(event.target.value);
  };

  useEffect(() => {
    setNumItems(sortedEdges.length);
  }, [sortedEdges]);

  const handleDownload = () => {
    const downloadUrl = 'https://raw.githubusercontent.com/travelgateX/integrations-roadmap/main/src/data/roadmap.json';
    window.open(downloadUrl);
  };

  const handleShare = () => {
    // Copy link
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl);
    alert('Link to Roadmap copied!');
  };
  return (
    <>
      <Helmet>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'
          crossorigin='anonymous'
        />
        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz'
          crossorigin='anonymous'
        ></script>
        <script
          src='https://kit.fontawesome.com/e1e13599a5.js'
          crossorigin='anonymous'
        ></script>

      </Helmet>
      <div className='container'>
        <header className='header navbar'>
          <div className="d-flex ">
            <img
              className='header-logo'
              src='https://www.travelgate.com/assets/img/logos/logo_travelgate_blue.svg'
              alt='Travelgatex Logo'
            />
          </div>


        <div className="d-md-flex justify-content-md-end">
          <a className="btn btn-primary" href="https://app.travelgatex.com" role="button">Sign in</a>
        </div>


        </header>
      </div>

      <div className="aux-hero">
        <div className='container'>
          <h1 className='hero-title mb-4'>
            Seller API development Roadmap{' '}
          </h1>
          <p className='hero-desc'>The Seller API Development within the Travelgate roadmap is dedicated to empowering sellers with cutting-edge tools and features, facilitating seamless and scalable collaboration within the travel industry.</p>
        </div>
        <img
            className='bg-aux-hero'
            src='bg_hero.svg'
            alt=''
          />
      </div>

      <div className='container'>
        <h4 className='header-subtitle mb-2'>
          Filter the items below:
        </h4>
        <div className='filters d-flex gap-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className='form-select'
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value=''>All Status</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Planned'>Planned</option>
            <option value='In Certification'>In Certification</option>
            <option value='ToDo'>ToDo</option>
          </select>

          <span className='sort-by-select'>Sort by {sortBy === 'Due_date' ? 'Available Date' : ''}</span>
            <select className='form-select' id="sort-direction-select" value={sortDirection} onChange={handleSortDirection}>
              <option value="asc">Oldest to newest</option>
              <option value="desc">Newest to oldest</option>
            </select>

        </div>
        <div className='navbar'>
          <div className='d-flex'>
            <strong>Showing <span id='items'>{numItems}</span> connectors:</strong>
          </div>

          <div className="d-md-flex justify-content-md-end items-links-container">
            <button
                className="btn btn-secondary roadmap-download-button btn-sm me-2"
                onClick={handleDownload}
            >
              Download
            </button>
            
            <button
                className="btn btn-light roadmap-share-link btn-sm"
                onClick={handleShare}
            >
              Share
            </button>
          </div>

        </div>

      </div>
      

      <div className='aux'>
        <div className='container'>
          <table className='roadmap-table table-hover'>
            <tbody>
              {sortedEdges.map(({ node }, index) => (
                <React.Fragment key={node.Summary}>
                  <div className="card">
                    <tr onClick={() => toggleDetails(index)}>
                      <div class="d-flex justify-content-between">
                        <td class="partner">
                            <i
                            className='fa-regular fa-chevron-up me-2'
                            id={`fa-chevron-down-${index}`}
                          ></i> <strong>{node.Summary}</strong></td>
                        
                        <td class="status">
                          <span className='me-2'>Status:</span>
                          <span
                            className={`badge text-bg-${node.Status.toLowerCase()}`}
                          >
                            {node.Status}
                          </span><br/>
                            <span className='me-2'>Available: </span>{formatDate(node.Due_date)}
                        </td>
                      </div>

                    </tr>
                    <tr id={`row-details-${index}`} className='row-details'>
                      <td colSpan='5'>
                        <div className='mb-3'>
                          <p>{node.External_Description}</p>
                        </div>
                        <p><span className='me-2 fw-bold'>Profile Link:</span>
                        <span><a href={node.Profile_Link}>{node.Profile_Link}</a></span> <br/>
                        <span className='me-2 fw-bold'>Status:</span>
                        <span>{node.Status}</span><br/>
                        <span className='me-2 fw-bold'>Available:</span>
                        <span>{node.Due_date}</span><br/>
                        </p>
                        <p>
                        <span className='me-2 fw-bold'>Added to roadmap:</span>
                        <span>{formatDate(node.Created)}</span><br/>
                        <span className='me-2 fw-bold'>Development Start:</span>
                        <span>{formatDate(node.Start_date)}</span><br/>
                        <span className='me-2 fw-bold'>Last Update:</span>
                        <span>{formatDate(node.Updated)}</span><br/>
                        </p>

                      </td>
                    </tr>
                  </div>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <footer className='footer'>
        <p>© {new Date().getFullYear()} Travelgatex</p>
      </footer>
    </>
  );
};

export const query = graphql`
  query {
    allRoadmapJson {
      edges {
        node {
          Summary
          Created
          Updated
          Status
          Due_date
          Start_date
          Profile_Link
          External_Description
        }
      }
    }
  }
`;

export default RoadmapPage;
