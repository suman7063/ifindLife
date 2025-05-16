
import React from 'react';
import { Container } from '@/components/ui/container';
import UserLoginContent from './UserLoginContent';
import { Card, CardContent } from '@/components/ui/card';
import UserLoginHeader from './UserLoginHeader';

const UserLoginPage: React.FC = () => {
  return (
    <Container className="py-8 md:py-12">
      <Card className="border shadow-lg max-w-md mx-auto">
        <CardContent className="pt-6">
          <UserLoginHeader />
          <UserLoginContent />
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserLoginPage;
