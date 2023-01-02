import { Room, Client } from "colyseus";

export class SignalingRoom extends Room {

  onCreate(options: any) {
    this.onMessage("candidate", this.onCandidate.bind(this));
    this.onMessage("desc", this.onDesc.bind(this));
  }

  onCandidate(client: Client, message: any) {
    this.clients.forEach((value: Client, index: number, array: Client[]) => {
      if (value.sessionId == message.sessionId) {
        message.sessionId = client.sessionId;
        value.send("candidate", message);
        return;
      }
    });
  }

  onDesc(client: Client, message: any) {
    this.clients.forEach((value: Client, index: number, array: Client[]) => {
      if (value.sessionId == message.sessionId) {
        message.sessionId = client.sessionId;
        value.send("desc", message);
        return;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.clients.forEach((value: Client, index: number, array: Client[]) => {
      if (value.sessionId != client.sessionId) {
        value.send("addPeer", {
          sessionId: client.sessionId,
          shouldCreateOffer: false,
        });
        client.send("addPeer", {
          sessionId: value.sessionId,
          shouldCreateOffer: true,
        });
      }
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.broadcast("removePeer", client.sessionId, {
      except: client,
    });
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
