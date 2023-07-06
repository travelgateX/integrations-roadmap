import { graphql } from 'gatsby';

export const roadmapQuery = graphql`
  query {
    allRoadmapJson {
      edges {
        node {
          Summary
          Created
          Updated
          Resolved
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
