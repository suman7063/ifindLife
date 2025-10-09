import { Link } from 'react-router-dom';

const SouliFooter = () => {
  return (
    <footer className="relative z-10 py-8 text-center">
      <p className="text-muted-foreground text-sm">
        Souli is evolved from{' '}
        <Link 
          to="/" 
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
        >
          iFindLife
        </Link>
      </p>
    </footer>
  );
};

export default SouliFooter;
