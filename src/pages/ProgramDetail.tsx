
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        if (!id) {
          console.error('Program ID is missing');
          return;
        }

        // Convert string ID to number for database query
        const programId = parseInt(id);
        if (isNaN(programId)) {
          console.error('Invalid program ID format');
          return;
        }

        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();

        if (error) {
          console.error('Error fetching program:', error);
          return;
        }

        setProgram(data);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return <div>Loading program details...</div>;
  }

  if (!program) {
    return <div>Program not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{program.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{program.description}</p>
          <p>Price: ${program.price}</p>
          <Button onClick={() => navigate('/programs')}>Back to Programs</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramDetail;
