import React, { useState } from 'react';
import { format } from 'date-fns';
import Helmet from 'react-helmet';
import './index.css';
import { roadmapQuery } from '../queries/roadmapQuery'; // Importa la consulta

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
    if (detailsRow && detailsChevron) {
      detailsRow.classList.toggle('show-details');
      detailsChevron.classList.toggle('rotate');
    }
  };

  const formatDate = (date) => {
    if (!date || date === 'Invalid Date NaN') {
      return '';
    }
    return format(new Date(date), 'yyyy-MM-dd');
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
        <headerclassName='header'>
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
            <option value='Target_End'>Target End</option>
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
              <th>Target End</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedEdges.map(({ node }, index) => (
              <React.Fragment key={node.Ticket_ID}>
                <tr onClick={() => toggleDetails(index)}>
                  <td>{node.Summary}</td>
                  <td>
                    <span
                      className={
                        node.Status === 'In Progress'
                          ? 'badge text-bg-primary'
                          : node.Status === 'Completed'
                          ? 'badge text-bg-success'
                          : node.Status === 'Planned'
                          ? 'badge text-bg-info'
                          : node.Status === 'In Certification'
                          ? 'badge text-bg-info'
                          : node.Status === 'ToDo'
                          ? 'badge text-bg-secondary'
                          : ''
                      }
                    >
                      {node.Status}
                    </span>
                  </td>
                  <td>{formatDate(node['Due date'])}</td>
                  <td>{formatDate(node['Target end'])}</td>
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
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Proin id nunc quis ante placerat dignissim. Fusce vulputate mi quis bibendum elementum. Etiam nec diam tellus. Fusce non magna massa. Nullam vehicula et ex eget pellentesque. Duis a eros vulputate, congue dui non, sollicitudin nunc.
                      </p>
                    </div>
                    <ul className='details-container list-unstyled ms-0'>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>Created:</span>
                        <span>{formatDate(node.Created)}</span>
                      </li>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>Updated:</span>
                        <span>{formatDate(node.Updated)}</span>
                      </li>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>
                          Last Transition Occurred:
                        </span>
                        <span>{formatDate(node.Last_Transition_Occurred)}</span>
                      </li>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>Ticket ID:</span>
                        <span>{node.Ticket_ID}</span>
                      </li>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>Tier:</span>
                        <span>{node.Tier}</span>
                      </li>
                      <li className='details-row'>
                        <span className='me-2 fw-bold'>
                          CRM Create DateTime:
                        </span>
                        <span>{formatDate(node['CRM Create DateTime'])}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoadmapPage;
