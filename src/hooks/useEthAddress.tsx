import { useActor } from "@/actor";
import { Principal } from "@dfinity/principal";
import { useQuery } from "@tanstack/react-query";

export default function useEthAddress(principal?: Principal) {
  const { actor: basic_eth } = useActor();
  return useQuery({
    queryKey: ['address', principal],
    queryFn: async () => {
      try {
        const result = await basic_eth?.get_address(principal ? [principal] : []);
        if (result === undefined) {
          throw new Error("Undefined address returned.")
        }
        if ('Err' in result) {
          throw new Error(result.Err);
        }
        return result.Ok;
      } catch (e) {
        console.log(e)
        throw new Error("Invalid address returned.")
      }
    },
    enabled: !!basic_eth
  })

}
