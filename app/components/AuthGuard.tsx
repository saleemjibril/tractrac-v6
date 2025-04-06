import { useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const AuthGuard = (props: any) => {
  const { profileInfo, userToken } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (props?.isAuth && (!profileInfo?.fname || !userToken)) {
      return router.replace("/");
    }
  });

  return <React.Fragment> {props.children} </React.Fragment>;
};
// export default dynamic(() => Promise.resolve(NoSSRWrapper), {
//   ssr: false,
// });
