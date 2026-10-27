import { useState, useCallback } from 'react';
import { RACK_SPACE_URL } from '../constants/config';

// Small helper: calls the API and throws an Error with the server message if it fails
const request = async (path = '', options = {}) => {
  const response = await fetch(`${RACK_SPACE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
};

const useRackSpace = () => {
  const [rackSpaces, setRackSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Runs an API call and handles loading and error state in one place
  const run = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError('');
      return await apiCall();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      throw err; // lets the component show its own message if it wants
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /api/v1/rack-space
  const fetchRackSpaces = useCallback(
    () =>
      run(async () => {
        const data = await request();
        setRackSpaces(data);
        return data;
      }),
    [run]
  );

  // GET /api/v1/rack-space/:styleNumber
  const fetchRackSpaceByStyle = useCallback(
    (styleNumber) => run(() => request(`/${styleNumber}`)),
    [run]
  );

  // POST /api/v1/rack-space/import (replaces all existing data)
  const importRackSpace = useCallback(
    (payload) => run(() => request('/import', { method: 'POST', body: JSON.stringify(payload) })),
    [run]
  );

  return {
    rackSpaces,
    loading,
    error,
    fetchRackSpaces,
    fetchRackSpaceByStyle,
    importRackSpace,
  };
};

export default useRackSpace;
