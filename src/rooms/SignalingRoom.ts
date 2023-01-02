import { Room, Client } from "colyseus";

export class SignalingRoom extends Room {

  onCreate(options: any) {
    this.onMessage("offer", this.onOffer.bind(this));
    this.onMessage("candidate", this.onCandidate.bind(this));
  }

  onOffer(client: Client, message: any) {
    const sessionDescription = message.sessionDescription;
    this.broadcast("offer", {
      sessionId: client.sessionId,
      sessionDescription: sessionDescription,
    });
  }

  onCandidate(client: Client, message: any) {
    const candidate = message.candidate;
    this.broadcast("candidate", {
      sessionId: client.sessionId,
      candidate: candidate,
    }, {
      except: client
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.clients.forEach((value: Client, index: number, array: Client[]) => {
      const shouldCreateOffer = value.sessionId != client.sessionId;
      value.send("addPeer", {
        sessionId: value.sessionId,
        shouldCreateOffer: shouldCreateOffer,
      });
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
