import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import VoteForm from './VoteForm';

const ElectionDetail = () => {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await api.get(`/elections/${electionId}`);
        setElection(response.data);
      } catch (error) {
        console.error('Fetch election error', error);
      }
    };

    fetchElection();
  }, [electionId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {election ? (
        <>
          <h2 className="text-3xl mb-4">{election.election_name}</h2>
          <p className="mb-2">Start Date: {new Date(election.start_date).toLocaleDateString()}</p>
          <p className="mb-6">End Date: {new Date(election.end_date).toLocaleDateString()}</p>
          <h3 className="text-2xl mb-4">Candidates</h3>
          <ul className="list-disc list-inside mb-6">
            {election.candidates.map(candidate => (
              <li key={candidate._id}>{candidate.candidate_name} ({candidate.party})</li>
            ))}
          </ul>
          <VoteForm electionId={election._id} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ElectionDetail;
