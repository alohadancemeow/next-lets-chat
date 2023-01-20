import React from "react";
import { Skeleton } from "@chakra-ui/react";

type Props = {
  count: number;
  height: string;
  width?: string;
};

const SkeletonLoader = ({ count, height, width }: Props) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Skeleton
          key={index}
          startColor="blackAlpha.400"
          endColor="whiteAlpha.300"
          height={height}
          width={{ base: "full", md: width }}
          borderRadius={4}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
