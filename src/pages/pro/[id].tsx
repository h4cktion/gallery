import { useRouter } from "next/router";
import React from "react";

const Pro = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>PRO {id}</div>;
};

export default Pro;
