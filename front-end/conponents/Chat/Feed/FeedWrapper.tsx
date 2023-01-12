import { Session } from "next-auth";
import React from "react";

type Props = {
  session: Session;
};

const FeedWrapper = ({ session }: Props) => {
  return <div>FeedWrapper</div>;
};

export default FeedWrapper;
