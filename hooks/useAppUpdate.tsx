import { useEffect } from "react";
import * as Updates from "expo-updates";

export const useAppUpdate = (): void => {
  useEffect(() => {
    async function checkForUpdate() {
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (isAvailable) {
          await Updates.fetchUpdateAsync();
          // Recarga la aplicación para cargar la actualización
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    checkForUpdate().then();
  }, []);
};
