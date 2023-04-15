import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useUserLawyerStatus = async () => {
  const { user } = useAuth();
  const [isLawyer, setLawyerStatus] = useState(false);

  useEffect(() => {
    (async () => {
      if (user) {
        const data = await getDoc(doc(getFirestore(), "users", user.uid));
        setLawyerStatus(data.data()?.lawyer);
      }
    })();
  }, [user]);

  return isLawyer;
};
