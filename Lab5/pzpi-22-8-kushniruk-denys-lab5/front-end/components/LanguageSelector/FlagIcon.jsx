import Image from "next/image";
import React from "react";

const FlagIcon = ({ countryCode }) => {
  return (
    <Image
      alt={countryCode}
      src={`https://flagcdn.com/w20/${countryCode}.png`}
      width={26}
      height={26}
    />
  );
};

export default FlagIcon;
