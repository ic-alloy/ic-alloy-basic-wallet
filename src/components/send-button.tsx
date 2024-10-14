import { LoaderCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import useEthAddress from "@/hooks/useEthAddress";
import { useMutation } from "@tanstack/react-query";
import { useActor } from "@/actor";
import { decimalStringToEth } from "@/lib/eth";

export default function SendButton() {
  const { isPending: isFetchingAddress } = useEthAddress();
  const { actor: basic_eth } = useActor();
  const { mutate: sendEth, isPending: isSending, isError, error, data: sendResult } = useMutation({
    mutationFn: async ({ to, amount }: { to: string, amount: string }) => {
      if (!basic_eth) {
        throw new Error('basic_eth actor not initialized');
      }
      return basic_eth.send_eth(to, decimalStringToEth(amount));
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEth({
      to: event.currentTarget.toAddress.value,
      amount: event.currentTarget.amount.value,
    });
  };

  if (error) console.log(error);

  return <Dialog >
    <DialogTrigger asChild>
      <Button disabled={isFetchingAddress} className="flex flex-col h-30 w-full items-start gap-1">
        <Send className="w-5 h-5" />Send
      </Button>
    </DialogTrigger>
    <DialogContent className='w-[400px]'>
      <DialogHeader>
        <DialogTitle>Send</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input type='text' placeholder='To address' name="toAddress" data-1p-ignore />
        <Input type='text' placeholder='Amount' name="amount" data-1p-ignore />
        <Button disabled={isSending} type="submit">{isSending ? <><LoaderCircle className="animate-spin w-4 h-4 mr-1" />Sending ...</> : "Send"}</Button>
        {isError &&
          <div className="font-semibold bg-destructive/30 rounded-lg p-2 text-destructive-foreground">
            There was an error sending ETH.
          </div>
        }
        {sendResult &&
          <pre className="bg-muted text-xs rounded-lg p-2 whitespace-pre-wrap break-all break-words box-border overflow-x-auto text-left">
            {JSON.stringify(sendResult)}
          </pre>
        }
      </form>
    </DialogContent>
  </Dialog>
}

