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
        return nodeA[sortField] > nodeB[sortField] ? 1 : -1;
      } else if (sortOrder === 'desc') {
        return nodeA[sortField] < nodeB[sortField] ? 1 : -1;
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
    const parsedDate = parse(dateString, 'LLLL yyyy', new Date());
    if (!isValid(parsedDate)) {
      return ''; // O cualquier otro valor predeterminado en caso de fecha inválida
     }
    return format(parsedDate, 'LLL yyyy');
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
      <div className='container-flex'>
        <header className='header'>
          <img
            className='header-logo'
            src='https://www.travelgate.com/assets/img/logos/logo_travelgate_blue.svg'
            alt='Travelgatex Logo'
          />
        </header>
      </div>
      <div className='container'>
        <h1 className='header-title mb-4'>
          Integrations Roadmap <small>(beta)</small>{' '}
        </h1>
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
            <option value='Summary'>Summary</option>
            <option value='Status'>Status</option>
            <option value='Due_date'>Due Date</option>
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

        <table className='roadmap-table table-hover'>
          <thead>
            <tr>
              <th>Summary</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedEdges.map(({ node }, index) => (
              <React.Fragment key={node.Summary}>
                <tr onClick={() => toggleDetails(index)}>
                  <td>{node.Summary}</td>
                  <td>
                    <span
                      className={`badge text-bg-${node.Status.toLowerCase()}`}
                    >
                      {node.Status}
                    </span>
                  </td>
                  <td>{formatDate(node.Due_date)}</td>
                  <td className='text-end'>
                    <i
                      className='fa-regular fa-chevron-down'
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
                    <span><a href="{node.Profile_Link}">{node.Profile_Link}</a></span> <br/>
                    <span className='me-2 fw-bold'>Status:</span>
                    <span>{node.Status}</span><br/>
                    <span className='me-2 fw-bold'>Due Date:</span>
                    <span>{node.Due_date}</span><br/>
                    </p>
                    <p>
                    <span className='me-2 fw-bold'>Created:</span>
                    <span>{formatDate(node.Created)}</span><br/>
                    <span className='me-2 fw-bold'>Start date:</span>
                    <span>{formatDate(node.Start_date)}</span><br/>
                    <span className='me-2 fw-bold'>Updated:</span>
                    <span>{formatDate(node.Updated)}</span><br/>
                    </p>

                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
