import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { format, isValid, parse } from 'date-fns';
import Helmet from 'react-helmet';
import './index.css';

const RoadmapPage = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  if (sortField && nodeA[sortField] && nodeB[sortField]) {
    if (sortOrder === 'asc') {
      return formatDate(nodeA[sortField]) - formatDate(nodeB[sortField]);
    } else if (sortOrder === 'desc') {
      return formatDate(nodeB[sortField]) - formatDate(nodeA[sortField]);
    }
  }

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
  const parsedDate = parse(dateString, 'MMM yyyy', new Date());
  if (!isValid(parsedDate)) {
    return ''; 
  }
  return parsedDate.getTime(); 
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
          <div class="d-flex ">
            <img
              className='header-logo'
              src='https://www.travelgate.com/assets/img/logos/logo_travelgate_blue.svg'
              alt='Travelgatex Logo'
            />
          </div>


        <div class="d-md-flex justify-content-md-end">
          <a class="btn btn-primary" href="https://app.travelgate.com" role="button">Sign in</a>
        </div>


        </header>
      </div>

      <div class="aux-hero">
        <div className='container'>
          <h1 className='hero-title mb-4'>
            Seller API development Roadmap{' '}
          </h1>
          <p className='hero-desc'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
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
          <select
            className='form-select'
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value=''>Sort By</option>
            <option value='Summary'>Supplier</option>
            <option value='Status'>Status</option>
            <option value='Due_date'>Available Date</option>
          </select>
          <select
            className='form-select'
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value=''>Order</option>
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>
      </div>
      

      <div class='aux'>
        <div className='container'>
          <table className='roadmap-table table-hover'>
            <tbody>
              {sortedEdges.map(({ node }, index) => (
                <React.Fragment key={node.Summary}>
                  <div class="card">
                    <tr onClick={() => toggleDetails(index)}>
                      <td><strong>{node.Summary}</strong></td>
                      
                      <td>                    <span className='me-2'>Status:</span>
                        <span
                          className={`badge text-bg-${node.Status.toLowerCase()}`}
                        >
                          {node.Status}
                        </span><br/>
                          <span className='me-2'>Available: </span>{formatDate(node.Due_date)}</td>
                      <td className='text-end'>
                        <i
                          className='fa-regular fa-chevron-up'
                          id={`fa-chevron-down-${index}`}
                        ></i>
                      </td>
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
