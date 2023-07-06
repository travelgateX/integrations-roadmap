import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { format } from 'date-fns';
import './index.css';

const RoadmapPage = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('');

  const { allRoadmapJson } = data;
  const { edges } = allRoadmapJson;

  const filteredEdges = edges.filter(edge => {
    const { node } = edge;

    // Filtrar por el campo Summary
    if (node.Summary.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }

    // Filtrar por todos los campos
    const values = Object.values(node);
    return values.some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
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

  const toggleDetails = index => {
    const detailsRow = document.getElementById(`row-details-${index}`);
    if (detailsRow) {
      detailsRow.classList.toggle('show-details');
    }
  };

  const formatDate = date => {
    if (!date) {
      return '';
    }
    return format(new Date(date), 'MMMM yyyy'); // Actualizado el formato de fecha
  };

  return (
    <div className="container">
      <header className="header">
        <img
          className="header-logo"
          src="https://www.travelgate.com/assets/img/logos/logo_travelgate_blue.svg"
          alt="Travelgatex Logo"
        />
        <h1 className="header-title">Integrations Roadmap <small>beta</small></h1>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="Summary">Summary</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="Status">Status</option>
          <option value="Due_date">Due Date</option>
          <option value="Start_date">Start Date</option>
          <option value="Target_start">Target Start</option>
          <option value="Target_end">Target End</option>
          <option value="Profile_Link">Profile Link</option>
          <option value="External_Description">External Description</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="">Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table className="roadmap-table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Start Date</th>
            <th>Target Start</th>
            <th>Target End</th>
            <th>Profile Link</th>
            <th>External Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedEdges.map(({ node }, index) => (
            <React.Fragment key={node.Summary}>
              <tr onClick={() => toggleDetails(index)}>
                <td>{node.Summary}</td>
                <td>{formatDate(node.Created)}</td>
                <td>{formatDate(node.Updated)}</td>
                <td>{node.Status}</td>
                <td>{formatDate(node['Due date'])}</td>
                <td>{formatDate(node['Start date'])}</td>
                <td>{formatDate(node['Target start'])}</td>
                <td>{formatDate(node['Target end'])}</td>
                <td>
                  <a href={node['Profile Link']} target="_blank" rel="noopener noreferrer">
                    {node['Profile Link']}
                  </a>
                </td>
                <td>{node['External Description']}</td>
              </tr>
              <tr id={`row-details-${index}`} className="row-details">
                <td colSpan="10">
                  <div className="details-container">
                    {/* Agrega los detalles adicionales aquí */}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Travelgatex. All rights reserved.</p>
      </footer>
    </div>
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
          Target_start
          Target_end
          Profile_Link
          External_Description
        }
      }
    }
  }
`;

export default RoadmapPage;
