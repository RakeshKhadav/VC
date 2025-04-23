declare module 'react-stars' {
  interface ReactStarsProps {
    count?: number;
    value?: number;
    char?: string;
    color1?: string;
    color2?: string;
    size?: number;
    edit?: boolean;
    half?: boolean;
    onChange?: (newRating: number) => void;
  }
  
  const ReactStars: React.FC<ReactStarsProps>;
  
  export default ReactStars;
}