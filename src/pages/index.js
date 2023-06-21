import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { format } from 'date-fns';
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

  const formatDate = (date) => {
    if (!date) {
      return '';
    }
    return format(new Date(date), 'yyyy-MM-dd');
  };

  return (
    <>
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
                  <td>{node.Status}</td>
                  <td>{formatDate(node.Due_date)}</td>
                  <td>{formatDate(node.Target_End)}</td>
                  <td class='text-end'>
                    <i
                      class='fa-regular fa-chevron-down'
                      id={`fa-chevron-down-${index}`}
                    ></i>
                  </td>
                </tr>
                <tr id={`row-details-${index}`} className='row-details'>
                  <td colSpan='5'>
                    <div className='details-container'>
                      <div className='details-row'>
                        <span>Created:</span>
                        <span>{formatDate(node.Created)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Updated:</span>
                        <span>{formatDate(node.Updated)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Last Transition Occurred:</span>
                        <span>{formatDate(node.Last_Transition_Occurred)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Ticket ID:</span>
                        <span>{node.Ticket_ID}</span>
                      </div>
                      <div className='details-row'>
                        <span>Tier:</span>
                        <span>{node.Tier}</span>
                      </div>
                      <div className='details-row'>
                        <span>CRM Create DateTime:</span>
                        <span>{formatDate(node.CRM_Create_DateTime)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Start date:</span>
                        <span>{formatDate(node.Start_date)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Rank:</span>
                        <span>{node.Rank}</span>
                      </div>
                      <div className='details-row'>
                        <span>Target Start:</span>
                        <span>{formatDate(node.Target_Start)}</span>
                      </div>
                      <div className='details-row'>
                        <span>Planned end:</span>
                        <span>{formatDate(node.Planned_end)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <footer className='footer'>
          <p>
            &copy; {new Date().getFullYear()} Travelgatex. All rights reserved.
          </p>
        </footer>
      </div>
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
          Last_Transition_Occurred
          Ticket_ID
          Tier
          CRM_Create_DateTime
          Start_date
          Rank
          Target_End
          Target_Start
          Planned_end
        }
      }
    }
  }
`;

export default RoadmapPage;
