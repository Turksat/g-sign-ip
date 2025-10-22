import React from "react";
import { Alert } from "@edk/ui-react";

interface LikelihoodRateDisplayProps {
  rate: number | 0;
  className?: string;
}

const LikelihoodRateDisplay: React.FC<LikelihoodRateDisplayProps> = ({
  rate,
}) => {
  // Rate'i yüzde olarak göster (0.0-1.0 arası değeri 0-100% olarak)
  const percentage = (rate * 100).toFixed(1);

  return (
    <Alert
      variant="info"
      message={`Based on the documents you have uploaded and the available patent data, the probability of your application being approved is estimated to be approximately ${percentage}%. This is based on an analysis of past applications with similar content.`}
    />
  );
};

export default LikelihoodRateDisplay;
