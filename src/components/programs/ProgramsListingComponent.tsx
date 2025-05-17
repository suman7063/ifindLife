import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ProgramsListingComponent = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('programs')
          .select('*');

        if (error) {
          console.error('Error fetching programs:', error);
        } else {
          setPrograms(data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div>
      <h1>Programs</h1>
      {loading ? (
        <p>Loading programs...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {programs.map((program) => (
            <Card key={program.id} style={{ width: '300px', margin: '10px' }}>
              <Link to={`/program/${program.id}`}>
                <h2>{program.title}</h2>
                <p>{program.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsListingComponent;
